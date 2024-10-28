const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/email");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = new User({ username, email, password });

  // Tạo OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP hết hạn sau 10 phút

  await user.save();

  // Gửi email xác thực
  await sendVerificationEmail(email, otp);

  res.status(201).json({
    message: "User registered. Please check your email for verification OTP.",
  });
});
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();
  const userData = {
    email: user.email,
    username: user.username,
    role: user.role,
    active: user.active,
    isVerified: user.isVerified,
    id: user._id,
  };
  res.json({
    message: "Email verified successfully",
    accessToken,
    refreshToken,
    user: userData,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(401)
      .json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Gửi email xác thực
    await sendVerificationEmail(email, otp);
    return res.json({ message: "Email not verified", emailNotVerify: true });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();
  const userData = {
    email: user.email,
    username: user.username,
    role: user.role,
    active: user.active,
    isVerified: user.isVerified,
    id: user._id,
  };

  res.json({ accessToken, refreshToken, user: userData });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  await sendPasswordResetEmail(user.email, resetToken);

  res.json({ message: "Password reset email sent" });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset" });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Từ middleware xác thực

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Refresh token is required", TokenFailed: true });
  }
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
    return res
      .status(403)
      .json({ message: "Invalid refresh token", TokenFailed: true });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res
      .status(403)
      .json({ message: "User not found", TokenFailed: true });
  }

  if (user.refreshToken !== refreshToken) {
    return res
      .status(403)
      .json({ message: "Invalid refresh token", TokenFailed: true });
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = newRefreshToken;
  await user.save();

  // Return new access token and refresh token
  return res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // Tìm user dựa trên refreshToken
  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res.status(204).json({
      message: "Logout successfully",
    });
  }
  user.refreshToken = null;
  await user.save();

  return res.status(204).json({
    message: "Logout successfully",
  });
});
module.exports = {
  login,
  verifyEmail,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
};
