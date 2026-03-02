import fs from 'fs';
import path from 'path';
import * as projectService from '../../services/projectService';
import { Project } from '../../models/projectModel';

jest.mock('fs');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

const mockFS = fs as jest.Mocked<typeof fs>;

describe('projectService', () => {
  const mockDB = {
    projects: [
      { id: '1', name: 'Project 1', description: 'Description 1' },
      { id: '2', name: 'Project 2', description: 'Description 2' },
    ],
    tasks: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFS.readFileSync.mockReturnValue(JSON.stringify(mockDB));
  });

  describe('getAllProjects', () => {
    it('should return all projects', () => {
      const projects = projectService.getAllProjects();
      expect(projects).toEqual(mockDB.projects);
      expect(mockFS.readFileSync).toHaveBeenCalled();
    });

    it('should return empty array when no projects exist', () => {
      mockFS.readFileSync.mockReturnValue(JSON.stringify({ projects: [], tasks: [] }));
      const projects = projectService.getAllProjects();
      expect(projects).toEqual([]);
    });
  });

  describe('addProject', () => {
    it('should add a new project with a generated UUID', () => {
      const newProject: Project = {
        id: '',
        name: 'New Project',
        description: 'New Description',
      };

      const result = projectService.addProject(newProject);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('New Project');
      expect(result.description).toBe('New Description');
      expect(mockFS.writeFileSync).toHaveBeenCalled();
    });

    it('should write updated data to database', () => {
      const newProject: Project = {
        id: '',
        name: 'Test Project',
        description: 'Test Description',
      };

      projectService.addProject(newProject);

      expect(mockFS.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('db.json'), expect.stringContaining('Test Project'));
    });
  });

  describe('getProjectById', () => {
    it('should return a project by ID', () => {
      const project = projectService.getProjectById('1');
      expect(project).toEqual(mockDB.projects[0]);
    });

    it('should return undefined if project not found', () => {
      const project = projectService.getProjectById('nonexistent');
      expect(project).toBeUndefined();
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', () => {
      const updatedProject: Project = {
        id: '1',
        name: 'Updated Project',
        description: 'Updated Description',
      };

      const result = projectService.updateProject('1', updatedProject);

      expect(result).toEqual(updatedProject);
      expect(mockFS.writeFileSync).toHaveBeenCalled();
    });

    it('should return undefined if project not found', () => {
      const updatedProject: Project = {
        id: 'nonexistent',
        name: 'Updated Project',
        description: 'Updated Description',
      };

      const result = projectService.updateProject('nonexistent', updatedProject);

      expect(result).toBeUndefined();
      expect(mockFS.writeFileSync).not.toHaveBeenCalled();
    });

    it('should write updated data to database', () => {
      const updatedProject: Project = {
        id: '1',
        name: 'Updated',
        description: 'Updated Desc',
      };

      projectService.updateProject('1', updatedProject);

      expect(mockFS.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('db.json'), expect.any(String));
    });
  });

  describe('deleteProject', () => {
    it('should delete an existing project', () => {
      const result = projectService.deleteProject('1');
      expect(result).toBe(true);
      expect(mockFS.writeFileSync).toHaveBeenCalled();
    });

    it('should return false if project not found', () => {
      const result = projectService.deleteProject('nonexistent');
      expect(result).toBe(false);
      expect(mockFS.writeFileSync).not.toHaveBeenCalled();
    });

    it('should remove project from database', () => {
      projectService.deleteProject('1');

      const writeCall = mockFS.writeFileSync.mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);

      expect(writtenData.projects).not.toContainEqual(expect.objectContaining({ id: '1' }));
    });
  });
});
