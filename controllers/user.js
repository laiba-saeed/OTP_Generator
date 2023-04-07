const moment = require("moment");
const otpGenerator = require("otp-generator");
const { Users } = require("../models");

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const { name, phone_number } = req.body;
      if (!name || !phone_number) {
        return res.status(400).json({ error: "Missing name or phone_number" });
      }
      const User = await Users.create({
        name,
        phone_number,
      });
      res.status(200).json({ message: "User Created" });
    } catch (error) {
      next(error);
    }
  },

  generateOTP: async (req, res, next) => {
    try {
      const { phone_number } = req.body;
      if (!phone_number) {
        return res.status(400).json({ error: "phone_number is missing" });
      }

      const user = await Users.findOne({ where: { phone_number } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const OTP = otpGenerator.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const expiration_date = moment().add(5, "minutes");
      user.otp = OTP;
      user.otp_expiration_date = expiration_date;
      await user.save();
      res.status(200).json({ user_id: user.id });
    } catch (error) {
      next(error);
    }
  },

  verifyOTP: async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const { otp } = req.query;
      if (!otp) {
        return res.status(400).json({ error: "Otp is required" });
      }
      const user = await Users.findOne({ where: { id: user_id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.otp !== otp) {
        return res.status(401).json({ error: "Incorrect OTP" }); //unauthorized access
      }
      const now = moment();
      const expiration_date = moment(user.otp_expiration_date);
      if (now.isAfter(expiration_date)) {
        return res.status(410).json({ error: "OTP expired" }); //requested resource is no longer available
      }
      // Clear OTP and expiration date from user record
      user.otp = null;
      user.otp_expiration_date = null;
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
};
