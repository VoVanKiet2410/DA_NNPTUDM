const PasswordResetToken = require('../schemas/PasswordResetToken');
const User = require('../schemas/User');
const ApiResponse = require('../utils/ApiResponse');

// Request password reset
exports.resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, 'Email not found'));
    }

    const token = new PasswordResetToken({
      user: user._id,
      token: Math.random().toString(36).substring(2),
      expiryDate: new Date(Date.now() + 3600000), // 1 hour
    });
    await token.save();

    // Simulate sending email
    console.log(`Password reset token: ${token.token}`);

    res.status(200).json(new ApiResponse(200, 'Password reset email sent successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error sending password reset email', error.message));
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const resetToken = await PasswordResetToken.findOne({ token }).populate('user');
    if (!resetToken || resetToken.expiryDate < Date.now()) {
      return res.status(400).json(new ApiResponse(400, 'Invalid or expired token'));
    }

    const user = resetToken.user;
    user.password = newPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    res.status(200).json(new ApiResponse(200, 'Password reset successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error resetting password', error.message));
  }
};