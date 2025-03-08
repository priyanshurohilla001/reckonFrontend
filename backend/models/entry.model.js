import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    doneAt: { type: Date },
    notes: {
        summary: [{ type: String }],
        userNote: { type: String }
    }
});

const Entry = mongoose.model("Entry", EntrySchema);

export default Entry;
