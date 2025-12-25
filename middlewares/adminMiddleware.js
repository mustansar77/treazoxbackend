import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    walletInfo: { type: Number, default: 0 },

    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null }, 
    referralEarnings: { type: Number, default: 0 },

    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// Auto-generate referral code before saving
userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode =
      "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
