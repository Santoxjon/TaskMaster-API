import { Request, Response } from 'express';
import * as taskController from '../../controllers/taskController';
import * as taskService from '../../services/taskService';

jest.mock('../../services/taskService');

const mockTaskService = taskService as jest.Mocked<typeof taskService>;

describe('taskController', () => {
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

  describe('listTasksByProject', () => {
    it('should return all tasks for a project', async () => {
      mockRequest.params = { projectId: '1' };

      const mockTasks = [
        {
          id: 'task1',
          projectId: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'PENDING' as const,
          dueDate: '2026-03-10',
        },
      ];

      mockTaskService.getTasksByProjectId.mockReturnValue(mockTasks);

      await taskController.listTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockTasks);
    });

    it('should return 204 No Content when no tasks exist', async () => {
      mockRequest.params = { projectId: '1' };

      mockTaskService.getTasksByProjectId.mockReturnValue([]);

      await taskController.listTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should filter tasks by status query parameter', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.query = { status: 'PENDING' };

      const mockTasks = [
        {
          id: 'task1',
          projectId: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'PENDING' as const,
          dueDate: '2026-03-10',
        },
      ];

      mockTaskService.getTasksByProjectId.mockReturnValue(mockTasks);

      await taskController.listTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(mockTaskService.getTasksByProjectId).toHaveBeenCalledWith('1', 'PENDING');
      expect(jsonMock).toHaveBeenCalledWith(mockTasks);
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '   ' };

      await taskController.listTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_PROJECT_ID',
        }),
      );
    });

    it('should return 400 when status filter is invalid', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.query = { status: 'INVALID_STATUS' };

      await taskController.listTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_STATUS',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1' };
      mockTaskService.getTasksByProjectId.mockImplementation(() => {
        throw new Error('DB error');
      });

      await taskController.listTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'GET_TASKS_ERROR',
        }),
      );
    });
  });

  describe('createTask', () => {
    it('should create a new task with valid data', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2026-03-20',
      };

      const newTask = {
        id: 'task1',
        projectId: '1',
        title: 'New Task',
        description: 'New Description',
        status: 'PENDING' as const,
        dueDate: '2026-03-20',
      };

      mockTaskService.addTask.mockReturnValue(newTask);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(newTask);
    });

    it('should create task with custom status', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2026-03-20',
        status: 'IN_PROGRESS',
      };

      const newTask = {
        id: 'task1',
        projectId: '1',
        title: 'New Task',
        description: 'New Description',
        status: 'IN_PROGRESS' as const,
        dueDate: '2026-03-20',
      };

      mockTaskService.addTask.mockReturnValue(newTask);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '' };
      mockRequest.body = {
        title: 'Task',
        description: 'Description',
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when title is missing', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        description: 'Description',
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'MISSING_FIELDS',
        }),
      );
    });

    it('should return 400 when description is missing', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when dueDate is missing', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: 'Description',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 422 when title is not a string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 123,
        description: 'Description',
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_FIELD_TYPE',
        }),
      );
    });

    it('should return 422 when description is not a string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: true,
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 422 when dueDate is not a string', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: 'Description',
        dueDate: 12345,
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 422 when title is empty', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: '   ',
        description: 'Description',
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'EMPTY_FIELDS',
        }),
      );
    });

    it('should return 422 when description is empty', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: '   ',
        dueDate: '2026-03-20',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
    });

    it('should return 422 when dueDate format is invalid', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: 'Description',
        dueDate: '03-20-2026',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_DATE_FORMAT',
        }),
      );
    });

    it('should return 422 when status is invalid', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: 'Description',
        dueDate: '2026-03-20',
        status: 'INVALID',
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_STATUS',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1' };
      mockRequest.body = {
        title: 'Task',
        description: 'Description',
        dueDate: '2026-03-20',
      };

      mockTaskService.addTask.mockImplementation(() => {
        throw new Error('DB error');
      });

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'CREATE_TASK_ERROR',
        }),
      );
    });
  });

  describe('updateTaskStatusHandler', () => {
    it('should update task status successfully', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = { status: 'COMPLETED' };

      const task = {
        id: 'task1',
        projectId: '1',
        title: 'Task',
        description: 'Description',
        status: 'COMPLETED' as const,
        dueDate: '2026-03-20',
      };

      mockTaskService.getTaskById.mockReturnValue(task);
      mockTaskService.updateTaskStatus.mockReturnValue(task);

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(task);
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '', taskId: 'task1' };
      mockRequest.body = { status: 'COMPLETED' };

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when taskId is empty', async () => {
      mockRequest.params = { projectId: '1', taskId: '' };
      mockRequest.body = { status: 'COMPLETED' };

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when status is missing', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = {};

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'MISSING_FIELDS',
        }),
      );
    });

    it('should return 422 when status is not a string', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = { status: 123 };

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_FIELD_TYPE',
        }),
      );
    });

    it('should return 422 when status is invalid', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = { status: 'INVALID' };

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_STATUS',
        }),
      );
    });

    it('should return 404 when task not found', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = { status: 'COMPLETED' };

      mockTaskService.getTaskById.mockReturnValue(undefined);

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'TASK_NOT_FOUND',
        }),
      );
    });

    it('should return 404 when task belongs to different project', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = { status: 'COMPLETED' };

      const task = {
        id: 'task1',
        projectId: '2',
        title: 'Task',
        description: 'Description',
        status: 'PENDING' as const,
        dueDate: '2026-03-20',
      };

      mockTaskService.getTaskById.mockReturnValue(task);

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'TASK_NOT_FOUND',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1', taskId: 'task1' };
      mockRequest.body = { status: 'COMPLETED' };

      mockTaskService.getTaskById.mockImplementation(() => {
        throw new Error('DB error');
      });

      await taskController.updateTaskStatusHandler(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'UPDATE_TASK_ERROR',
        }),
      );
    });
  });

  describe('getTaskStats', () => {
    it('should return task statistics for a project', async () => {
      mockRequest.params = { projectId: '1' };

      const stats = {
        PENDING: 2,
        IN_PROGRESS: 1,
        COMPLETED: 3,
      };

      mockTaskService.getTaskStatsByProjectId.mockReturnValue(stats);

      await taskController.getTaskStats(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(stats);
    });

    it('should return zero counts when no tasks exist', async () => {
      mockRequest.params = { projectId: '1' };

      const stats = {
        PENDING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
      };

      mockTaskService.getTaskStatsByProjectId.mockReturnValue(stats);

      await taskController.getTaskStats(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(stats);
    });

    it('should return 400 when projectId is empty', async () => {
      mockRequest.params = { projectId: '   ' };

      await taskController.getTaskStats(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_PROJECT_ID',
        }),
      );
    });

    it('should handle errors with 500 status', async () => {
      mockRequest.params = { projectId: '1' };

      mockTaskService.getTaskStatsByProjectId.mockImplementation(() => {
        throw new Error('DB error');
      });

      await taskController.getTaskStats(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'GET_STATS_ERROR',
        }),
      );
    });
  });
});
