const depositSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  amount: { type: Number, required: true },     // credited
  fee: { type: Number, required: true },        // platform fee
  totalPaid: { type: Number, required: true },  // amount + fee

  exchange: {
    name: String,
    network: String,
    address: String,
  },

  trxId: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  approvedAt: Date,
}, { timestamps: true });
