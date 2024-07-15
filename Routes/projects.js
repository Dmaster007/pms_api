// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/Auth");
const { createProject, getProjects,getProjectById, deleteProject, updateProject} = require("../Controllers/project");

// Routes with authentication middleware
router.post("/createProject", authMiddleware, createProject);
router.get("/getProjects", authMiddleware, getProjects);
router.get("/getProject/:id", authMiddleware, getProjectById);
router.put("/updateProject/:id", authMiddleware, updateProject);
router.delete("/deleteProject/:id", authMiddleware, deleteProject);

module.exports = router;
