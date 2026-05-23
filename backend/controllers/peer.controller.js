// controllers/peer.controller.js — Peer matching and chat channel provisioning

const User = require("../models/User.model");
const PeerMatch = require("../models/PeerMatch.model");
const { findBestMatch } = require("../utils/peerMatcher.utils");
const { createPeerChannel } = require("../utils/stream.utils");

const STUDENT_FIELDS = "name avatar skillMetrics xp badges";

const populateMatchById = (id) =>
  PeerMatch.findById(id).populate("students", STUDENT_FIELDS);

/**
 * Ensure match has a valid Stream channel; repair DB if missing.
 */
const ensureMatchChannel = async (peerMatch) => {
  if (peerMatch.streamChannelId) return peerMatch;

  const students = peerMatch.students;
  if (!students || students.length < 2) return peerMatch;

  const a = students[0];
  const b = students[1];
  const idA = a._id || a;
  const idB = b._id || b;

  let nameA = a.name;
  let nameB = b.name;
  let imageA = a.avatar;
  let imageB = b.avatar;

  if (!nameA || !nameB) {
    const users = await User.find({ _id: { $in: [idA, idB] } }).select("name avatar");
    const userA = users.find((u) => u._id.toString() === idA.toString());
    const userB = users.find((u) => u._id.toString() === idB.toString());
    nameA = userA?.name || "Student";
    nameB = userB?.name || "Student";
    imageA = userA?.avatar;
    imageB = userB?.avatar;
  }

  const channelId = await createPeerChannel(idA, idB, peerMatch.matchReason, {
    nameA,
    nameB,
    imageA,
    imageB,
  });

  if (channelId) {
    peerMatch.streamChannelId = channelId;
    await peerMatch.save();
  }

  return peerMatch;
};

/** Peer IDs the user is already actively matched with (one connection per pair). */
const getAlreadyMatchedPeerIds = async (userId) => {
  const myId = userId.toString();
  const matches = await PeerMatch.find({
    students: userId,
    status: "active",
  }).select("students");

  const peerIds = new Set();
  matches.forEach((m) => {
    m.students.forEach((s) => {
      const id = s.toString();
      if (id !== myId) peerIds.add(id);
    });
  });
  return [...peerIds];
};

/**
 * @desc   Find and create a new peer match (user may have many active matches)
 * @route  POST /api/peers/match
 * @access Private
 */
const findPeerMatch = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const enrolledCourseIds = currentUser.enrolledCourses.map((e) => e.course);

    if (enrolledCourseIds.length === 0) {
      return res.status(400).json({ message: "Enroll in a course first to find a peer match." });
    }

    const alreadyMatchedPeerIds = await getAlreadyMatchedPeerIds(currentUser._id);

    const candidates = await User.find({
      _id: { $nin: [currentUser._id, ...alreadyMatchedPeerIds] },
      role: "student",
      "enrolledCourses.course": { $in: enrolledCourseIds },
    });

    if (candidates.length === 0) {
      return res.status(404).json({
        message:
          alreadyMatchedPeerIds.length > 0
            ? "No new peers available. You're already matched with everyone in your courses, or enroll in more courses."
            : "No other students found in your courses yet.",
      });
    }

    const result = findBestMatch(currentUser, candidates);

    if (!result) {
      return res.status(404).json({ message: "Could not find a compatible peer right now." });
    }

    const { match, reason, skills } = result;

    const existingPair = await PeerMatch.findOne({
      status: "active",
      students: { $all: [currentUser._id, match._id] },
    });

    if (existingPair) {
      await ensureMatchChannel(existingPair);
      const populated = await populateMatchById(existingPair._id);
      return res.json({
        message: "You are already matched with this peer.",
        match: populated,
      });
    }

    const channelId = await createPeerChannel(currentUser._id, match._id, reason, {
      nameA: currentUser.name,
      nameB: match.name,
      imageA: currentUser.avatar,
      imageB: match.avatar,
    });

    const peerMatch = await PeerMatch.create({
      students: [currentUser._id, match._id],
      matchReason: reason,
      complementarySkills: skills,
      streamChannelId: channelId || "",
    });

    if (!channelId) {
      await ensureMatchChannel(peerMatch);
    }

    const populatedMatch = await populateMatchById(peerMatch._id);

    res.status(201).json({
      message: "Peer match found!",
      match: populatedMatch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   All active peer matches for the logged-in user
 * @route  GET /api/peers/my-matches
 * @access Private
 */
const getMyMatches = async (req, res) => {
  try {
    const matches = await PeerMatch.find({
      students: { $in: [req.user._id] },
      status: "active",
    }).sort({ createdAt: -1 });

    for (const m of matches) {
      await ensureMatchChannel(m);
    }

    const populated = await PeerMatch.find({
      students: { $in: [req.user._id] },
      status: "active",
    })
      .populate("students", STUDENT_FIELDS)
      .sort({ createdAt: -1 });

    res.json({ matches: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   One active match by id (must include current user)
 * @route  GET /api/peers/matches/:matchId
 * @access Private
 */
const getMatchById = async (req, res) => {
  try {
    let match = await PeerMatch.findOne({
      _id: req.params.matchId,
      students: { $in: [req.user._id] },
      status: "active",
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    await ensureMatchChannel(match);
    const populated = await populateMatchById(match._id);

    res.json({ match: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   First active match (backward compatible)
 * @route  GET /api/peers/my-match
 * @access Private
 */
const getMyMatch = async (req, res) => {
  try {
    const matches = await PeerMatch.find({
      students: { $in: [req.user._id] },
      status: "active",
    }).sort({ createdAt: -1 });

    if (!matches.length) {
      return res.status(404).json({ message: "No active peer match found." });
    }

    for (const m of matches) {
      await ensureMatchChannel(m);
    }

    const populated = await PeerMatch.find({
      students: { $in: [req.user._id] },
      status: "active",
    })
      .populate("students", STUDENT_FIELDS)
      .sort({ createdAt: -1 });

    res.json({ match: populated[0], matches: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get all peer matches (admin only)
 * @route  GET /api/peers/all
 * @access Private (Admin)
 */
const getAllMatches = async (req, res) => {
  try {
    const matches = await PeerMatch.find()
      .populate("students", "name email")
      .sort({ createdAt: -1 });

    res.json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  findPeerMatch,
  getMyMatches,
  getMyMatch,
  getMatchById,
  getAllMatches,
};
