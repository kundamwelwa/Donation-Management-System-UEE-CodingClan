const Project = require('../models/ProjectListing'); // Adjust the path as necessary
const Orphanage = require('../models/Orphanages');
const mongoose = require('mongoose');

/**
 * Middleware to authorize that the authenticated orphanage owns the project.
 */
const authorizeProject = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const projectId = req.params.id; // Get the project ID from request parameters

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID.' });
    }

    // Fetch the orphanage associated with the authenticated user
    const orphanage = await Orphanage.findOne({ user: userId });

    if (!orphanage) {
      return res.status(404).json({ message: 'Orphanage not found for this user.' });
    }

    // Check if the project belongs to the orphanage
    const project = await Project.findOne({ _id: projectId, orphanage: orphanage._id });

    if (!project) {
      return res.status(403).json({ message: 'You are not authorized to modify this project.' });
    }

    // Attach the project to the request object for further use if needed
    req.project = project;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
  }
};

module.exports = authorizeProject;
