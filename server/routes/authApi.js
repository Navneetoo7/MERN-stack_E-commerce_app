const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const auth = require("../middleware/Authorization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("../config/keys");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
  }
});
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password should have at least 5  charcters").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email: email });
      console.log(password, user.password);
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: `invalide user or password ${password}` }] });
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalide user or password" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("server not running");
    }
  }
);
module.exports = router;
