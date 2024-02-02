import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reftokenSchema = new Schema({
    token: { type: String, unique: true }
}, { timestamps: false });

export default mongoose.model("refreshtoken", reftokenSchema);