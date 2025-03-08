import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true },
    locationCoordinates: {
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    }
});

const College = mongoose.model("College", CollegeSchema);

export default College;
