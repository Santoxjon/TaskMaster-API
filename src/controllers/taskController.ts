import { Request, Response } from 'express';
import { getTasksByProjectId, addTask, getTaskById, updateTaskStatus, getTaskStatsByProjectId } from '../services/taskService';
import { TaskStatus, VALID_TASK_STATUSES } from '../models/taskModel';

export async function listTasksByProject(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const id = typeof projectId === 'string' ? projectId : projectId[0];
    const { status } = req.query;

    // Validar que el ID no esté vacío
    if (!id || id.trim().length === 0) {
      res.status(400).json({
        error: 'El parámetro projectId es obligatorio y no puede estar vacío',
        code: 'INVALID_PROJECT_ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar status si se proporciona
    if (status && !VALID_TASK_STATUSES.includes(status as TaskStatus)) {
      res.status(400).json({
        error: 'El parámetro status no es válido. Debe ser: PENDING, IN_PROGRESS o COMPLETED',
        code: 'INVALID_STATUS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const tasks = getTasksByProjectId(id, status as string | undefined);
    if (!tasks.length) {
      res.status(204).send();
      return;
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener tareas',
      code: 'GET_TASKS_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const id = typeof projectId === 'string' ? projectId : projectId[0];
    const { title, description, dueDate, status } = req.body;

    // Validar que el ID no esté vacío
    if (!id || id.trim().length === 0) {
      res.status(400).json({
        error: 'El parámetro projectId es obligatorio y no puede estar vacío',
        code: 'INVALID_PROJECT_ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar campos obligatorios (status es opcional, se establecerá a PENDING por defecto)
    if (!title || !description || !dueDate) {
      res.status(400).json({
        error: 'Faltan campos obligatorios: title, description, dueDate',
        code: 'MISSING_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar tipos de datos
    if (typeof title !== 'string' || typeof description !== 'string' || typeof dueDate !== 'string') {
      res.status(422).json({
        error: 'Los campos deben ser strings',
        code: 'INVALID_FIELD_TYPE',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar que no estén vacíos
    if (title.trim().length === 0 || description.trim().length === 0) {
      res.status(422).json({
        error: 'Los campos title y description no pueden estar vacíos',
        code: 'EMPTY_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar status si se proporciona
    const taskStatus = status || 'PENDING';
    if (status && !VALID_TASK_STATUSES.includes(status)) {
      res.status(422).json({
        error: 'El estado debe ser: PENDING, IN_PROGRESS o COMPLETED',
        code: 'INVALID_STATUS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      res.status(422).json({
        error: 'La fecha debe estar en formato YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const newTask = addTask({
      id: '',
      projectId: id,
      title: title.trim(),
      description: description.trim(),
      status: taskStatus as TaskStatus,
      dueDate,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear la tarea',
      code: 'CREATE_TASK_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function updateTaskStatusHandler(req: Request, res: Response): Promise<void> {
  try {
    const { projectId, taskId } = req.params;
    const projectIdStr = typeof projectId === 'string' ? projectId : projectId[0];
    const taskIdStr = typeof taskId === 'string' ? taskId : taskId[0];
    const { status } = req.body;

    // Validar que los IDs no estén vacíos
    if (!projectIdStr || projectIdStr.trim().length === 0) {
      res.status(400).json({
        error: 'El parámetro projectId es obligatorio y no puede estar vacío',
        code: 'INVALID_PROJECT_ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!taskIdStr || taskIdStr.trim().length === 0) {
      res.status(400).json({
        error: 'El parámetro taskId es obligatorio y no puede estar vacío',
        code: 'INVALID_TASK_ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar que status esté presente
    if (!status) {
      res.status(400).json({
        error: 'El campo status es obligatorio',
        code: 'MISSING_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar tipo de dato
    if (typeof status !== 'string') {
      res.status(422).json({
        error: 'El campo status debe ser string',
        code: 'INVALID_FIELD_TYPE',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar valor de status
    if (!VALID_TASK_STATUSES.includes(status as TaskStatus)) {
      res.status(422).json({
        error: 'El estado debe ser: PENDING, IN_PROGRESS o COMPLETED',
        code: 'INVALID_STATUS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Obtener tarea y verificar que pertenezca al proyecto
    const task = getTaskById(taskIdStr);
    if (!task) {
      res.status(404).json({
        error: 'Tarea no encontrada',
        code: 'TASK_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (task.projectId !== projectIdStr) {
      res.status(404).json({
        error: 'Tarea no encontrada en este proyecto',
        code: 'TASK_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Actualizar estado
    const updatedTask = updateTaskStatus(taskIdStr, status);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar la tarea',
      code: 'UPDATE_TASK_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function getTaskStats(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const id = typeof projectId === 'string' ? projectId : projectId[0];

    // Validar que el ID no esté vacío
    if (!id || id.trim().length === 0) {
      res.status(400).json({
        error: 'El parámetro projectId es obligatorio y no puede estar vacío',
        code: 'INVALID_PROJECT_ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const stats = getTaskStatsByProjectId(id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener estadísticas de tareas',
      code: 'GET_STATS_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}
