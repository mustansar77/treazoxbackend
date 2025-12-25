const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    role: { type: String, enum: ['SUPERADMIN', 'ADMIN', 'GUIDE', 'USER'], default: 'USER' },
    isActive: { type: Boolean, default: true },
    walletInfo: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Hash password and generate referral code before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (!this.referralCode) {
    this.referralCode = `${this._id.toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
  }
 
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
