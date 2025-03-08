import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    course: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String, required: true }, // Changed from ObjectId to String
    tags: [{ type: String }],
    money: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

export default User;
