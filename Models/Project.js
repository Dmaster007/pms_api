// models/Project.js
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  desc: { type: String },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
