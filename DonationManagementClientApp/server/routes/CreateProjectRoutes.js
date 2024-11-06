const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/CreateProjectController');
const authenticateToken = require('../middlewares/authMiddlewares');
const authorizeProject = require('../middlewares/AuthorizeProject');
const { errorHandler } = require('../middlewares/errorHandler');
const { validateProjectCreation, validateProjectUpdate } = require('../middlewares/ProjectValidation'); // Adjust path as necessary
const upload = require('../middlewares/upload'); // Import the multer setup for handling file uploads

// Create a new project (Orphanage only)
// Use the upload middleware to handle image uploads
router.post('/createProject', authenticateToken, upload.single('image'), validateProjectCreation, ProjectController.createProject);
;

// Get all ongoing projects (Donors and Orphanages)
router.get('/ongoing', authenticateToken, ProjectController.getAllProjects); // Use getAllProjects if that's what you meant

// Get a specific project by ID (Donors and Orphanages)
router.get('/:id', authenticateToken, ProjectController.getProjectById); // Ensure this method is implemented in the controller

// Update a project (Orphanage only)
// Use the upload middleware to handle image upload if needed for updates
router.put('/update/:id', authenticateToken, authorizeProject, upload.single('image'), validateProjectUpdate, ProjectController.updateProject);

// Delete a project (Orphanage only)
router.delete('/delete/:id', authenticateToken, authorizeProject, ProjectController.deleteProject);

// Get all projects posted by the logged-in orphanage
router.get('/myProjects', authenticateToken, ProjectController.getMyProjects);

// Error Handling Middleware
router.use(errorHandler);

module.exports = router;
