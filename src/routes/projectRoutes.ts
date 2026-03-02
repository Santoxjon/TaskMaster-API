import { Router } from 'express';
import { listProjects, createProject, getProject, updateProjectById, deleteProjectById } from '../controllers/projectController';
import taskRoutes from './taskRoutes';

const router = Router();

// GET /api/v1/projects - obtener todos los proyectos
router.get('/', listProjects);

// POST /api/v1/projects - crear un nuevo proyecto
router.post('/', createProject);

// GET /api/v1/projects/:projectId - obtener un proyecto
router.get('/:projectId', getProject);

// PUT /api/v1/projects/:projectId - actualizar un proyecto
router.put('/:projectId', updateProjectById);

// DELETE /api/v1/projects/:projectId - eliminar un proyecto
router.delete('/:projectId', deleteProjectById);

// Tareas: GET/POST /api/v1/projects/:projectId/tasks
router.use('/:projectId/tasks', taskRoutes);

export default router;
