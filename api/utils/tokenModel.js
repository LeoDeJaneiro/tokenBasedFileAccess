const { Schema, model } = require("mongoose");

const TokenSchema = new Schema(
  {
    title: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isRejected: Boolean,
    usageCount: { type: Number, default: 0 },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = model("Token", TokenSchema);
