import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },

    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // remaining days
    dailyEarning: { type: Number, required: true },

    exchange: { type: String },
    trxId: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
    },

    startDate: { type: Date },
    endDate: { type: Date },
    lastEarningAt: { type: Date }, // 🔥 prevents double credit
  },
  { timestamps: true }
);

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);
