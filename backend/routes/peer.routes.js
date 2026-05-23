// routes/peer.routes.js — Peer matching routes

const express = require("express");
const router = express.Router();
const {
  findPeerMatch,
  getMyMatches,
  getMyMatch,
  getMatchById,
  getAllMatches,
} = require("../controllers/peer.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

// POST /api/peers/match — find a new peer (multiple matches allowed)
router.post("/match", protect, findPeerMatch);

// GET /api/peers/my-matches — all active matches for current user
router.get("/my-matches", protect, getMyMatches);

// GET /api/peers/my-match — first match (legacy)
router.get("/my-match", protect, getMyMatch);

// GET /api/peers/matches/:matchId — one match for chat
router.get("/matches/:matchId", protect, getMatchById);

// GET /api/peers/all — admin only
router.get("/all", protect, restrictTo("admin"), getAllMatches);

module.exports = router;
