// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js'; // 1. Asegúrate de importar esto
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);//getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};  


const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        const categories = await getCategoriesByProjectId(projectId);

        const title = project.title;
        
        res.render('project', { title, project, categories });
    } catch (err) {
        console.error('Error fetching project details:', err);
        res.status(500).send('Server Error');
    }
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage};