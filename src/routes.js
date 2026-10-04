import express from 'express';
import { body } from "express-validator";
import { showHomePage } from './controllers/index.js';
import { testErrorPage } from './controllers/errors.js';
//ORGANIZATION
import { 
    showOrganizationsPage,
    showNewOrganizationForm , 
    processNewOrganizationForm, 
    organizationValidation, 
    showEditOrganizationForm,    
    processEditOrganizationForm   
} from './controllers/organizations.js';
//PROJECTS
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm, 
    processNewProjectForm,
    projectValidation,
    showEditProjectForm, 
    processEditProjectForm 
 } from './controllers/projects.js';
//CATEGORIES
 import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm, 
    processNewCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm 
} from './controllers/categories.js';
//USERS
import{
  processUserRegistrationForm,
  showUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  requireLogin,
  requireRole,
  showUsers
} from './controllers/users.js'


import { showOrganizationDetailsPage } from './controllers/organizations.js';

const router = express.Router();

//BASE
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
// error-handling routes
router.get('/test-error', testErrorPage);

//ORGANIZATION
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);
// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

//PROJECT
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation , processNewProjectForm);
router.get("/edit-project/:id", requireRole('admin'), showEditProjectForm);
router.post("/edit-project/:id", requireRole('admin'), projectValidation, processEditProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

//CATEGORY
router.get("/new-category", requireRole('admin'), showNewCategoryForm);
router.post(
  "/new-category", requireRole('admin'),
  [ body("name").notEmpty().withMessage("Name is required").isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters") ],
  processNewCategoryForm
);
router.get("/edit-category/:id",requireRole('admin'), showEditCategoryForm);
router.post(
  "/edit-category/:id",requireRole('admin'),
  [ body("name").notEmpty().withMessage("Name is required").isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters") ],
  processEditCategoryForm
);



// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showUsers);


export default router;