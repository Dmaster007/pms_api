// controllers/projectController.js
const Project = require("../Models/Project");

// Create a new project
const createProject = async (req, res) => {
    req.body.lead = req.user;
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("lead members");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("lead members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports ={deleteProject , createProject , updateProject , getProjectById , getProjects }


