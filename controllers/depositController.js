import Deposit from "../models/Deposit.js";
import User from "../models/User.js";

// ----------------- USER: Submit Deposit -----------------
export const submitDeposit = async (req, res) => {
  try {
    const { amount, exchange, trxId } = req.body;
    const userId = req.user._id;

    if (!amount || !trxId || !exchange) {
      return res.status(400).json({ message: "All fields are required" });
    }
     const FEE_PERCENT = 5; // example
    const fee = (amount * FEE_PERCENT) / 100;
    const totalPaid = amount + fee;

    const deposit = await Deposit.create({
      user: userId,
      amount,
       fee,
      totalPaid,
      exchange: JSON.parse(exchange),
      trxId,
    });

    res.status(201).json({ success: true, deposit,
      summary: {
        amount,
        fee,
        totalPaid,
      }, });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- ADMIN: Get All Deposits -----------------
export const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate("user", "email fullName");
    res.json({ success: true, deposits });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- ADMIN: Update Deposit Status -----------------
export const updateDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const deposit = await Deposit.findById(id);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    if (deposit.status === "approved") {
      return res.status(400).json({ message: "Deposit already approved" });
    }

    deposit.status = status;

    if (status === "approved") {
      const user = await User.findById(deposit.user);
      user.balance += deposit.amount; // ONLY amount
      await user.save();

      deposit.approvedAt = new Date();
    }

    await deposit.save();

    res.json({ success: true, deposit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
