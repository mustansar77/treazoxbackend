import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    walletInfo: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Generate referral code if not exists
  if (!this.referralCode) {
    this.referralCode = `${this._id.toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// ✅ Export model (avoid recompiling model in Next.js hot reload)
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
