import { Request, Response } from 'express';
import * as projectController from '../../controllers/projectController';
import * as projectService from '../../services/projectService';

jest.mock('../../services/projectService');

const mockProjectService = projectService as jest.Mocked<typeof projectService>;

describe('projectController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn().mockReturnValue(undefined);
    sendMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    } as any;

    mockRequest = {
      params: {},
      body: {},
      query: {},
    } as any;
  });

  describe('listProjects', () => {
    it('should return all projects with status 200', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', description: 'Description 1' },
        { id: '2', name: 'Project 2', description: 'Description 2' },
      ];

      mockProjectService.getAllProjects.mockReturnValue(mockProjects);

      await projectController.listProjects(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockProjects);
    });

    it('should return 204 No Content when no projects exist', async () => {
      mockProjectService.getAllProjects.mockReturnValue([]);

      await projectController.listProjects(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should handle errors with 500 status', async () => {
      mockProjectService.getAllProjects.mockImplementation(() => {
        throw new Error('Database error');
      });

      await projectController.listProjects(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
          code: 'GET_PROJECTS_ERROR',
        }),
      );
    });
  });

  describe('createProject', () => {
    it('should create a new project with valid data', async () => {
      mockRequest.body = {
        name: 'New Project',
        description: 'New Description',
      };

      const newProject = { id: '3', name: 'New Project', description: 'New Description' };
      mockProjectService.addProject.mockReturnValue(newProject);

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(newProject);
    });

    it('should return 400 when name is missing', async () => {
      mockRequest.body = {
        description: 'Description',
      };

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'MISSING_FIELDS',
        }),
      );
    });

    it('should return 400 when description is missing', async () => {
      mockRequest.body = {
        name: 'Project Name',
      };

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 422 when name is not a string', async () => {
      mockRequest.body = {
        name: 123,
        description: 'Description',
      };

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_FIELD_TYPE',
        }),
      );
    });

    it('should return 422 when description is not a string', async () => {
      mockRequest.body = {
        name: 'Project',
        description: true,
      };

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 422 when name is empty string', async () => {
      mockRequest.body = {
        name: '   ',
        description: 'Description',
      };

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'EMPTY_FIELDS',
        }),
      );
    });

    it('should return 422 when description is empty string', async () => {
      mockRequest.body = {
        name: 'Project',
        description: '   ',
      };

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should handle service errors with 500 status', async () => {
      mockRequest.body = {
        name: 'Project',
        description: 'Description',
      };

      mockProjectService.addProject.mockImplementation(() => {
        throw new Error('DB error');
      });

      await projectController.createProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'CREATE_PROJECT_ERROR',
        }),
      );
    });
  });

  describe('getProject', () => {
    it('should return a project by ID', async () => {
      mockRequest.params = { projectId: '1' };

      const mockProject = { id: '1', name: 'Project', description: 'Desc' };
      mockProjectService.getProjectById.mockReturnValue(mockProject);

      await projectController.getProject(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockProject);
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '   ' };

      await projectController.getProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_PROJECT_ID',
        }),
      );
    });

    it('should return 404 when project not found', async () => {
      mockRequest.params = { projectId: 'nonexistent' };
      mockProjectService.getProjectById.mockReturnValue(undefined);

      await projectController.getProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'PROJECT_NOT_FOUND',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1' };
      mockProjectService.getProjectById.mockImplementation(() => {
        throw new Error('DB error');
      });

      await projectController.getProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'GET_PROJECT_ERROR',
        }),
      );
    });
  });

  describe('updateProjectById', () => {
    it('should update a project with valid data', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: 'Updated Project',
        description: 'Updated Description',
      };

      const updatedProject = { id: '1', name: 'Updated Project', description: 'Updated Description' };
      mockProjectService.updateProject.mockReturnValue(updatedProject);

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(updatedProject);
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '' };
      mockRequest.body = {
        name: 'Updated',
        description: 'Updated',
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when name is missing', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        description: 'Description',
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when description is missing', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: 'Name',
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 422 when name is not a string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: 123,
        description: 'Description',
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 400 when description is not a string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: 'Name',
        description: false,
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 422 when name is empty string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: '   ',
        description: 'Description',
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 422 when description is empty string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: 'Name',
        description: '   ',
      };

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 404 when project not found', async () => {
      mockRequest.params = { projectId: 'nonexistent' };
      mockRequest.body = {
        name: 'Updated',
        description: 'Updated',
      };

      mockProjectService.updateProject.mockReturnValue(undefined);

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'PROJECT_NOT_FOUND',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        name: 'Updated',
        description: 'Updated',
      };

      mockProjectService.updateProject.mockImplementation(() => {
        throw new Error('DB error');
      });

      await projectController.updateProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'UPDATE_PROJECT_ERROR',
        }),
      );
    });
  });

  describe('deleteProjectById', () => {
    it('should delete a project successfully', async () => {
      mockRequest.params = { projectId: '1' };
      mockProjectService.deleteProject.mockReturnValue(true);

      await projectController.deleteProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '' };

      await projectController.deleteProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 404 when project not found', async () => {
      mockRequest.params = { projectId: 'nonexistent' };
      mockProjectService.deleteProject.mockReturnValue(false);

      await projectController.deleteProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'PROJECT_NOT_FOUND',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1' };
      mockProjectService.deleteProject.mockImplementation(() => {
        throw new Error('DB error');
      });

      await projectController.deleteProjectById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'DELETE_PROJECT_ERROR',
        }),
      );
    });
  });
});
