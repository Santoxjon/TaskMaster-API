import fs from 'fs';
import path from 'path';
import * as taskService from '../../services/taskService';
import { Task } from '../../models/taskModel';

jest.mock('fs');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

const mockFS = fs as jest.Mocked<typeof fs>;

describe('taskService', () => {
  const mockDB = {
    projects: [],
    tasks: [
      {
        id: 'task1',
        projectId: 'project1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING' as const,
        dueDate: '2026-03-10',
      },
      {
        id: 'task2',
        projectId: 'project1',
        title: 'Task 2',
        description: 'Description 2',
        status: 'IN_PROGRESS' as const,
        dueDate: '2026-03-15',
      },
      {
        id: 'task3',
        projectId: 'project2',
        title: 'Task 3',
        description: 'Description 3',
        status: 'COMPLETED' as const,
        dueDate: '2026-03-05',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFS.readFileSync.mockReturnValue(JSON.stringify(mockDB));
    mockFS.writeFileSync.mockReturnValue(undefined as any);
  });

  describe('getTasksByProjectId', () => {
    it('should return all tasks for a project', () => {
      const tasks = taskService.getTasksByProjectId('project1');
      expect(tasks).toHaveLength(2);
      expect(tasks[0].projectId).toBe('project1');
      expect(tasks[1].projectId).toBe('project1');
    });

    it('should return empty array if no tasks exist for project', () => {
      const tasks = taskService.getTasksByProjectId('nonexistent');
      expect(tasks).toEqual([]);
    });

    it('should filter tasks by status', () => {
      const tasks = taskService.getTasksByProjectId('project1', 'PENDING');
      expect(tasks).toHaveLength(1);
      expect(tasks[0].status).toBe('PENDING');
    });

    it('should filter by IN_PROGRESS status', () => {
      const tasks = taskService.getTasksByProjectId('project1', 'IN_PROGRESS');
      expect(tasks).toHaveLength(1);
      expect(tasks[0].status).toBe('IN_PROGRESS');
    });

    it('should return empty array when filtering by status with no matches', () => {
      const tasks = taskService.getTasksByProjectId('project1', 'COMPLETED');
      expect(tasks).toEqual([]);
    });
  });

  describe('addTask', () => {
    it('should add a new task with a generated UUID', () => {
      const newTask: Task = {
        id: '',
        projectId: 'project1',
        title: 'New Task',
        description: 'New Description',
        status: 'PENDING',
        dueDate: '2026-03-20',
      };

      const result = taskService.addTask(newTask);

      expect(result.id).toBeDefined();
      expect(result.title).toBe('New Task');
      expect(result.projectId).toBe('project1');
      expect(mockFS.writeFileSync).toHaveBeenCalled();
    });

    it('should write updated data to database', () => {
      const newTask: Task = {
        id: '',
        projectId: 'project1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        dueDate: '2026-03-25',
      };

      taskService.addTask(newTask);

      expect(mockFS.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('db.json'), expect.stringContaining('Test Task'));
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', () => {
      const task = taskService.getTaskById('task1');
      expect(task).toEqual(mockDB.tasks[0]);
    });

    it('should return undefined if task not found', () => {
      const task = taskService.getTaskById('nonexistent');
      expect(task).toBeUndefined();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update a task status', () => {
      const result = taskService.updateTaskStatus('task1', 'COMPLETED');

      expect(result?.status).toBe('COMPLETED');
      expect(mockFS.writeFileSync).toHaveBeenCalled();
    });

    it('should return undefined if task not found', () => {
      const result = taskService.updateTaskStatus('nonexistent', 'PENDING');
      expect(result).toBeUndefined();
      expect(mockFS.writeFileSync).not.toHaveBeenCalled();
    });

    it('should update to IN_PROGRESS status', () => {
      const result = taskService.updateTaskStatus('task1', 'IN_PROGRESS');
      expect(result?.status).toBe('IN_PROGRESS');
    });

    it('should write updated data to database', () => {
      taskService.updateTaskStatus('task1', 'COMPLETED');

      expect(mockFS.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('db.json'), expect.any(String));
    });
  });

  describe('getTaskStatsByProjectId', () => {
    it('should return task statistics for a project', () => {
      const stats = taskService.getTaskStatsByProjectId('project1');

      expect(stats).toEqual({
        PENDING: 1,
        IN_PROGRESS: 1,
        COMPLETED: 0,
      });
    });

    it('should return zero counts for project with no tasks', () => {
      const stats = taskService.getTaskStatsByProjectId('nonexistent');

      expect(stats).toEqual({
        PENDING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
      });
    });

    it('should correctly count all statuses', () => {
      const stats = taskService.getTaskStatsByProjectId('project2');

      expect(stats).toEqual({
        PENDING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 1,
      });
    });

    it('should return correct counts with multiple statuses', () => {
      mockFS.readFileSync.mockReturnValue(
        JSON.stringify({
          projects: [],
          tasks: [
            {
              id: 't1',
              projectId: 'p1',
              title: 'T1',
              description: 'D1',
              status: 'PENDING',
              dueDate: '2026-03-10',
            },
            {
              id: 't2',
              projectId: 'p1',
              title: 'T2',
              description: 'D2',
              status: 'PENDING',
              dueDate: '2026-03-10',
            },
            {
              id: 't3',
              projectId: 'p1',
              title: 'T3',
              description: 'D3',
              status: 'IN_PROGRESS',
              dueDate: '2026-03-10',
            },
            {
              id: 't4',
              projectId: 'p1',
              title: 'T4',
              description: 'D4',
              status: 'COMPLETED',
              dueDate: '2026-03-10',
            },
          ],
        }),
      );

      const stats = taskService.getTaskStatsByProjectId('p1');

      expect(stats).toEqual({
        PENDING: 2,
        IN_PROGRESS: 1,
        COMPLETED: 1,
      });
    });
  });
});
