import { Router } from 'express';
import { listProjects, createProject, getProject, updateProjectById, deleteProjectById } from '../controllers/projectController';

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

export default router;
