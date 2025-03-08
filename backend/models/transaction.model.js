import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    entryId: { type: mongoose.Schema.Types.ObjectId, ref: "Entry", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["expense", "borrow", "lend", "received"], required: true },
    description: { type: String, required: true },
    closingBalance: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
