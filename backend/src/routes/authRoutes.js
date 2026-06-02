const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  register,
  login
} = require("../controllers/authController");
const {
  getAuthUrl,
  handleCallback
} = require("../controllers/driveController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  }
);
router.get("/google/drive", authMiddleware, getAuthUrl);
router.get("/google/callback", handleCallback);

module.exports = router;