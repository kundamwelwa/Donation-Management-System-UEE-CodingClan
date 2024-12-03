const mongoose = require('mongoose');
const Project = require('../models/ProjectListing'); 
const multer = require('multer');


exports.createProject = async (req, res) => {
  try {
    const { projectName, description, projectType, projectedAmount, category, startDate, endDate, location } = req.body;

    if (!projectName || !description || !projectType || !projectedAmount || !category || !startDate || !endDate || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const imageUri = req.file.path;
    const newProject = new Project({
      projectName: projectName,
      description,
      projectType,
      projectedAmount,
      currentAmount: 0, 
      status: 'active', 
      category,
      startDate,
      endDate,
      location,
      imageUri,
      Orphanage: req.user.id, 
    });

    const savedProject = await newProject.save();

    const Orphanage = await Orphanage.findById(req.user.id);
    if (!Orphanage) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    Orphanage.projects.push(savedProject._id);
    await Orphanage.save(); 

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



exports.getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find()
      .populate('Orphanage', 'OrphanageName coverPhoto') 
      .select('projectName description projectedAmount currentAmount status Orphanage category startDate endDate imageUri');

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
      .populate('Orphanage', 'OrphanageName coverPhoto')
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

// Get projects posted by the logged-in Orphanage
exports.getMyProjects = async (req, res) => {
  try {
    const OrphanageId = req.user.id; // Assuming the Orphanage ID is available in the token
    const projects = await Project.find({ Orphanage: OrphanageId })
      .populate('Orphanage', 'OrphanageName coverPhoto')
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
