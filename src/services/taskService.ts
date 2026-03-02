import fs from 'fs';
import path from 'path';
import { Task, TaskStatus } from '../models/taskModel';

const DB_PATH = path.join(__dirname, '../../data/db.json');

function readDB(): { projects: any[]; tasks: Task[] } {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDB(db: { projects: any[]; tasks: Task[] }) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getTasksByProjectId(projectId: string, status?: string): Task[] {
  const db = readDB();
  let tasks = db.tasks.filter((t) => t.projectId === projectId);

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  return tasks;
}

export function addTask(task: Task): Task {
  const db = readDB();
  const { v4: uuidv4 } = require('uuid');
  const newTask = { ...task, id: uuidv4() };
  db.tasks.push(newTask);
  writeDB(db);
  return newTask;
}

export function getTaskById(id: string): Task | undefined {
  const db = readDB();
  return db.tasks.find((t) => t.id === id);
}

export function updateTaskStatus(id: string, status: string): Task | undefined {
  const db = readDB();
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return undefined;
  task.status = status as TaskStatus;
  writeDB(db);
  return task;
}

export function getTaskStatsByProjectId(projectId: string): { PENDING: number; IN_PROGRESS: number; COMPLETED: number } {
  const db = readDB();
  const tasks = db.tasks.filter((t) => t.projectId === projectId);

  return {
    PENDING: tasks.filter((t) => t.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
  };
}
