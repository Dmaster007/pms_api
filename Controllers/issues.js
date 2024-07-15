const Issue = require("../Models/Issue");
const crypto = require("crypto-js");

function generateRandomHash(length = 4) {
  const randomString = crypto.lib.WordArray.random(length);
  const hash = crypto.SHA256(randomString).toString(crypto.enc.Hex);
  return hash;
}

const getAllIssues = async (req, res) => {
  try {
    // Fetch all issues with populated assignee details
    const issues = await Issue.find()
      .populate("assignee", "name email isAdmin")
      .populate({
        path: "project",
        select: "title desc lead members",
        populate: {
          path: "members",
          select: "name email isAdmin",
        },
      });

    if (!req.user.isAdmin) {
      const filteredIssues = issues.filter(
        (issue) =>
          issue.assignee._id.equals(req.user._id) ||
          issue.user._id.equals(req.user._id)
      );
      
      res.status(200).json({ issues: filteredIssues });
    } else {
      res.status(200).json({ issues });
    }
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createIssue = async (req, res) => {
  const {
    title,
    content,
    progress,
    priority,
    startDate,
    dueDate,
    assignee,
    category,
    project
  } = req.body;
  const user = req.user;

  if (!content || !title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newIssue = new Issue({
      user: user._id,
      title: title + generateRandomHash(),
      content,
      progress,
      priority,
      category,
      startDate,
      dueDate,
      assignee,
      project,
    });

    const savedIssue = await newIssue.save();

    res.status(201).json({
      issue: {
        id: savedIssue._id,
        user: savedIssue.user,
        title: savedIssue.title,
        content: savedIssue.content,
        createdAt: savedIssue.createdAt,
        assignee: savedIssue.assignee,
      },
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateIssue = async (req, res) => {
  const {
    title,
    content,
    progress,
    priority,
    startDate,
    dueDate,
    assignee,
    category,
    status,
  } = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Issue ID is required" });
  }

  try {
    const updatedFields = {};
    if (title) {
      updatedFields.title = title + generateRandomHash();
    }
    if (content) {
      updatedFields.content = content;
    }
    if (progress !== undefined) {
      updatedFields.progress = progress;
    }
    if (priority !== undefined) {
      updatedFields.priority = priority;
    }
    if (startDate) {
      updatedFields.startDate = new Date(startDate);
    }
    if (dueDate) {
      updatedFields.dueDate = new Date(dueDate);
    }
    if (assignee) {
      updatedFields.assignee = assignee;
    }
    if (category) {
      updatedFields.category = category;
    }
    if (status) {
      updatedFields.status = status;
    }
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (updatedIssue) {
      res.status(200).json({
        message: "Issue successfully updated",
        issue: {
          id: updatedIssue._id,
          user: updatedIssue.user,
          title: updatedIssue.title,
          content: updatedIssue.content,
          createdAt: updatedIssue.createdAt,
        },
      });
    } else {
      res.status(404).json({ message: "Issue not found" });
    }
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteIssue = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Issue ID is required" });
  }

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (deletedIssue) {
      res.status(200).json({
        message: "Issue successfully deleted",
        issue: {
          id: deletedIssue._id,
          user: deletedIssue.user,
          title: deletedIssue.title,
          content: deletedIssue.content,
          createdAt: deletedIssue.createdAt,
        },
      });
    } else {
      res.status(404).json({ message: "Issue not found" });
    }
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllIssues, createIssue, deleteIssue, updateIssue };
