import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  title: String,
  content: String,
  summary: String,
  tags: [String],
  editedAt: { type: Date, default: Date.now },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  summary: { type: String, default: "" },
  tags: [{ type: String, trim: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  versions: [versionSchema]
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
