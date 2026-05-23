// utils/stream.utils.js — Stream Chat integration for peer messaging

const { StreamChat } = require("stream-chat");

let permissionsConfigured = false;

const getStreamClient = () => {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn("Stream API keys not set. Peer chat will not work.");
    return null;
  }

  return StreamChat.getInstance(apiKey, apiSecret);
};

/**
 * Stream apps often block ReadChannel for the default "user" role.
 * Grant messaging permissions so matched peers can open their private channels.
 */
const configureStreamPermissions = async () => {
  if (permissionsConfigured) return true;

  const client = getStreamClient();
  if (!client) return false;

  // Default "user" role cannot ReadChannel on messaging — only channel_member can.
  // Merge these into existing grants so peers can open 1:1 rooms.
  const requiredForPeers = {
    user: [
      "read-channel",
      "read-channel-members",
      "create-channel",
      "create-message-owner",
      "create-reaction-owner",
      "delete-message-owner",
      "delete-reaction-owner",
      "update-message-owner",
      "upload-attachment",
      "add-links-owner",
      "remove-own-channel-membership",
    ],
    channel_member: [
      "read-channel",
      "read-channel-members",
      "create-message",
      "create-reaction",
      "delete-message-owner",
      "delete-reaction-owner",
      "update-message-owner",
      "upload-attachment",
      "add-links",
      "remove-own-channel-membership",
    ],
  };

  let mergedGrants = requiredForPeers;

  try {
    const channelTypeConfig = await client.getChannelType("messaging");
    const existing = channelTypeConfig?.grants;
    if (existing && typeof existing === "object") {
      mergedGrants = { ...existing };
      for (const [role, perms] of Object.entries(requiredForPeers)) {
        const current = new Set(mergedGrants[role] || []);
        perms.forEach((p) => current.add(p));
        mergedGrants[role] = [...current];
      }
    }
  } catch {
    /* use requiredForPeers only */
  }

  try {
    await client.updateChannelType("messaging", {
      grants: mergedGrants,
    });
    permissionsConfigured = true;
    console.log("Stream Chat: messaging permissions configured for peer chat");
    return true;
  } catch (err) {
    console.warn("Stream updateChannelType grants failed:", err.message);

    if (process.env.NODE_ENV === "development") {
      try {
        await client.updateAppSettings({
          disable_permissions_checks: true,
        });
        permissionsConfigured = true;
        console.warn(
          "⚠️ Stream Chat: permission checks disabled (development only). Do not use in production."
        );
        return true;
      } catch (fallbackErr) {
        console.error("Stream permission fallback failed:", fallbackErr.message);
      }
    }

    return false;
  }
};

const generateStreamToken = (userId) => {
  const client = getStreamClient();
  if (!client) return null;
  return client.createToken(String(userId));
};

const buildPeerChannelId = (studentAId, studentBId) => {
  const ids = [String(studentAId), String(studentBId)].sort();
  return `peer-${ids[0]}-${ids[1]}`;
};

const createPeerChannel = async (studentAId, studentBId, matchReason, userMeta = {}) => {
  const client = getStreamClient();
  if (!client) return null;

  await configureStreamPermissions();

  const idA = String(studentAId);
  const idB = String(studentBId);
  const channelId = buildPeerChannelId(idA, idB);

  try {
    await client.upsertUsers([
      {
        id: idA,
        name: userMeta.nameA || "Student",
        image: userMeta.imageA,
      },
      {
        id: idB,
        name: userMeta.nameB || "Student",
        image: userMeta.imageB,
      },
    ]);

    const channel = client.channel("messaging", channelId, {
      members: [idA, idB],
      name: "Peer Study Room",
      description: matchReason || "Peer study partners",
      created_by_id: idA,
    });

    try {
      await channel.create();
      await channel.sendMessage({
        text: `You've been matched as study partners! ${matchReason || ""}`.trim(),
        user_id: idA,
      });
    } catch (createErr) {
      const isDuplicate =
        createErr.status === 409 ||
        createErr.statusCode === 409 ||
        createErr.code === 4 ||
        /already exists/i.test(createErr.message || "");

      if (!isDuplicate) throw createErr;

      await channel.addMembers([idA, idB]);
    }

    // Ensure both users are channel members (fixes ReadChannel for the non-creator peer)
    const state = await channel.query({ state: true });
    const memberIds = new Set(
      Object.keys(state.members || {}).map((id) => String(id))
    );
    const missing = [idA, idB].filter((id) => !memberIds.has(id));
    if (missing.length) {
      await channel.addMembers(missing);
    }

    return channelId;
  } catch (error) {
    console.error("Stream channel creation error:", error.message);
    return null;
  }
};

module.exports = {
  getStreamClient,
  configureStreamPermissions,
  generateStreamToken,
  createPeerChannel,
  buildPeerChannelId,
};
