import { Request, Response } from 'express';
import { getAllProjects, addProject, getProjectById, updateProject, deleteProject } from '../services/projectService';

export async function listProjects(req: Request, res: Response): Promise<void> {
  try {
    const projects = getAllProjects();
    if (!projects.length) {
      res.status(204).send();
      return;
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener proyectos',
      code: 'GET_PROJECTS_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    const { name, description } = req.body;

    // Validar campos obligatorios
    if (!name || !description) {
      res.status(400).json({
        error: 'Faltan campos obligatorios: name, description',
        code: 'MISSING_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar que sean strings
    if (typeof name !== 'string' || typeof description !== 'string') {
      res.status(422).json({
        error: 'Los campos name y description deben ser strings',
        code: 'INVALID_FIELD_TYPE',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar que no estén vacíos
    if (name.trim().length === 0 || description.trim().length === 0) {
      res.status(422).json({
        error: 'Los campos name y description no pueden estar vacíos',
        code: 'EMPTY_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const newProject = addProject({
      id: '',
      name: name.trim(),
      description: description.trim(),
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el proyecto',
      code: 'CREATE_PROJECT_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function getProject(req: Request, res: Response): Promise<void> {
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

    const project = getProjectById(id);
    if (!project) {
      res.status(404).json({
        error: 'Proyecto no encontrado',
        code: 'PROJECT_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el proyecto',
      code: 'GET_PROJECT_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}
export async function updateProjectById(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const id = typeof projectId === 'string' ? projectId : projectId[0];
    const { name, description } = req.body;

    // Validar que el ID no esté vacío
    if (!id || id.trim().length === 0) {
      res.status(400).json({
        error: 'El parámetro projectId es obligatorio y no puede estar vacío',
        code: 'INVALID_PROJECT_ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar campos obligatorios
    if (!name || !description) {
      res.status(400).json({
        error: 'Faltan campos obligatorios: name, description',
        code: 'MISSING_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar que sean strings
    if (typeof name !== 'string' || typeof description !== 'string') {
      res.status(422).json({
        error: 'Los campos name y description deben ser strings',
        code: 'INVALID_FIELD_TYPE',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validar que no estén vacíos
    if (name.trim().length === 0 || description.trim().length === 0) {
      res.status(422).json({
        error: 'Los campos name y description no pueden estar vacíos',
        code: 'EMPTY_FIELDS',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const updatedProject = updateProject(id, {
      id,
      name: name.trim(),
      description: description.trim(),
    });

    if (!updatedProject) {
      res.status(404).json({
        error: 'Proyecto no encontrado',
        code: 'PROJECT_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el proyecto',
      code: 'UPDATE_PROJECT_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function deleteProjectById(req: Request, res: Response): Promise<void> {
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

    const success = deleteProject(id);
    if (!success) {
      res.status(404).json({
        error: 'Proyecto no encontrado',
        code: 'PROJECT_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el proyecto',
      code: 'DELETE_PROJECT_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}
