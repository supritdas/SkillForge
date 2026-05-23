// models/PeerMatch.model.js — Stores peer matches between students

const mongoose = require("mongoose");

const peerMatchSchema = new mongoose.Schema(
  {
    // The two students who were matched
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Why they were matched (AI reasoning)
    matchReason: {
      type: String,
      default: "",
    },
    // Complementary skills that made this a good match
    complementarySkills: [{ type: String }],
    // Stream Chat channel ID for their private room
    streamChannelId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PeerMatch", peerMatchSchema);
