import { Router } from 'express';
import { listTasksByProject, createTask, updateTaskStatusHandler, getTaskStats } from '../controllers/taskController';

const router = Router({ mergeParams: true });

// GET /api/v1/projects/:projectId/tasks - obtener tareas de un proyecto
router.get('/', listTasksByProject);

// GET /api/v1/projects/:projectId/tasks/stats - obtener estadísticas de tareas
router.get('/stats', getTaskStats);

// POST /api/v1/projects/:projectId/tasks - crear tarea en un proyecto
router.post('/', createTask);

// PATCH /api/v1/projects/:projectId/tasks/:taskId/status - actualizar estado de una tarea
router.patch('/:taskId/status', updateTaskStatusHandler);

export default router;
