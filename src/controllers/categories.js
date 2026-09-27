import { getProjectDetails } from '../models/projects.js';

import { getAllCategories, getCategoryById, getProjectsByCategoryId,
    updateCategoryAssignments, assignCategoryToProject, getCategoriesByProjectId
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

export { showCategoriesPage, showCategoryDetailsPage,
    showAssignCategoriesForm,processAssignCategoriesForm
 };