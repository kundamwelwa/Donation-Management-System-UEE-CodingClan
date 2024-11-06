const mongoose = require('mongoose');
const Project = require('../models/ProjectListing'); // Adjust path if needed
const multer = require('multer'); // For handling file uploads if needed

// Create a new project (Orphanage only)
exports.createProject = async (req, res) => {
  try {
    // Extract project details from the request body
    const {projectName, description, projectType, projectedAmount, category, startDate, endDate, location } = req.body;

    // Check if all required fields are present
    if (!projectName || !description || !projectType || !projectedAmount || !category || !startDate || !endDate || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate the file upload (if image is required)
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Capture the image URI from multer's file path
    const imageUri = req.file.path; // Adjust if multer's configuration saves to a different path

    // Create a new project instance
    const newProject = new Project({
      projectName: projectName, // Ensure name field aligns with schema's name property
      description,
      projectType,
      projectedAmount,
      currentAmount: 0, // Default to 0 when creating
      status: 'active', // Default status
      category,
      startDate,
      endDate,
      location,
      imageUri,
      orphanage: req.user.id, // Assuming the orphanage ID is available in the token
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    // Return only necessary details
    res.status(201).json({
      id: savedProject._id,
      projectName: savedProject.projectName,
      description: savedProject.description,
      projectType: savedProject.projectType,
      projectedAmount: savedProject.projectedAmount,
      currentAmount: savedProject.currentAmount,
      category: savedProject.category,
      startDate: savedProject.startDate,
      endDate: savedProject.endDate,
      location: savedProject.location,
      status: savedProject.status,
      imageUri: savedProject.imageUri, // Include image URI in response
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all projects
exports.getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find()
      .populate('orphanage', 'orphanageName coverPhoto') // Populate orphanage details
      .select('projectName description projectedAmount currentAmount status orphanage category startDate endDate imageUri');

    if (projects.length === 0) {
      return res.status(200).json({ message: 'No projects available yet.' });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific project by ID (Donors and Orphanages)
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findById(id)
      .populate('orphanage', 'orphanageName coverPhoto')
      .select('projectName description projectedAmount currentAmount status category startDate endDate imageUri');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Update a project (Orphanage only)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const updates = req.body;
    const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a project (Orphanage only)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get projects posted by the logged-in orphanage
exports.getMyProjects = async (req, res) => {
  try {
    const orphanageId = req.user.id; // Assuming the orphanage ID is available in the token
    const projects = await Project.find({ orphanage: orphanageId })
      .populate('orphanage', 'orphanageName coverPhoto')
      .select('projectName description projectedAmount currentAmount status category startDate endDate imageUri');

    if (projects.length === 0) {
      return res.status(200).json({ message: 'You have not posted any projects yet.' });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching your projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
