const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/CreateProjectController');
const authenticateToken = require('../middlewares/authMiddlewares');
const authorizeProject = require('../middlewares/AuthorizeProject');
const { errorHandler } = require('../middlewares/errorHandler');
const { validateProjectCreation, validateProjectUpdate } = require('../middlewares/ProjectValidation');
const upload = require('../middlewares/upload'); // Import the multer setup for handling file uploads

// Create a new project
router.post(
  '/createProject',
  authenticateToken,
  upload.single('image'),
  validateProjectCreation,
  ProjectController.createProject
);

// Get all ongoing projects
router.get('/ongoing', authenticateToken, ProjectController.getAllProjects);

// Get a specific project by ID
router.get('/:id', authenticateToken, ProjectController.getProjectById);

// Update an existing project
router.put(
  '/update/:id',
  authenticateToken,
  authorizeProject,
  upload.single('image'),
  validateProjectUpdate,
  ProjectController.updateProject
);

// Delete a project
router.delete(
  '/delete/:id',
  authenticateToken,
  authorizeProject,
  ProjectController.deleteProject
);

// Get all projects created by the logged-in user
router.get('/myProjects', authenticateToken, ProjectController.getMyProjects);

// Centralized error handling middleware
router.use(errorHandler);

module.exports = router;
