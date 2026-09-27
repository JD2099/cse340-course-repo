import { getProjectDetails } from '../models/projects.js';
import { validationResult } from "express-validator";
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    updateCategoryAssignments, assignCategoryToProject, 
    getCategoriesByProjectId,
    createCategory, 
    updateCategory, 
    getCategoryDetails
 } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', { title, category, projects });
    } catch (err) {
        console.error('Error fetching category details:', err);
        res.status(500).send('Server Error');
    }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = (req, res) => {
  res.render("new-category", { title: "Add New Category" });
};

const processNewCategoryForm = async (req, res) => {
  const { name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash("error", error.msg));
    return res.redirect("/new-category");
  }

  try {
    const newCategoryId = await createCategory(name);
    req.flash("success", "Category created successfully!");
    res.redirect(`/edit-category/${newCategoryId}`);
  } catch (error) {
    console.error("Error creating category:", error);
    req.flash("error", "There was an error creating the category.");
    res.redirect("/new-category");
  }
};

const showEditCategoryForm = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryDetails(categoryId);

    if (!category) {
      return res.status(404).render("errors/404", { title: "Category Not Found" });
    }

    res.render("update-category", { title: "Edit Category", category });
  } catch (error) {
    console.error("Error loading edit category form:", error);
    res.status(500).render("errors/500", { title: "Server Error", error: error.message });
  }
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash("error", error.msg));
    return res.redirect(`/edit-category/${categoryId}`);
  }

  try {
    await updateCategory(categoryId, name);
    req.flash("success", "Category updated successfully!");
    res.redirect(`/edit-category/${categoryId}`);
  } catch (error) {
    console.error("Error updating category:", error);
    req.flash("error", "There was an error updating the category.");
    res.redirect(`/edit-category/${categoryId}`);
  }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm, 
    processNewCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm
 };