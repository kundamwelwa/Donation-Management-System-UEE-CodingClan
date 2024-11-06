const Project = require('../models/ProjectListing'); // Adjust the path as necessary

// Middleware to authorize user access to a specific project
const authorizeProject = async (req, res, next) => {
  try {
    const projectId = req.params.id; // Assuming project ID is in the route parameter 'id'

    // Fetch the project from the database
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the authenticated orphanage user is the owner of the project
    if (project.orphanage.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this project.' });
    }

    // Attach the project to the request object for further use if needed
    req.project = project;

    next(); // User is authorized, proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
  }
};

module.exports = authorizeProject;
