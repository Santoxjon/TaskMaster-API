import fs from 'fs';
import path from 'path';
import { Project } from '../models/projectModel';

const DB_PATH = path.join(__dirname, '../../data/db.json');

function readDB(): { projects: Project[]; tasks: any[] } {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDB(db: { projects: Project[]; tasks: any[] }) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getAllProjects(): Project[] {
  const db = readDB();
  return db.projects;
}

export function addProject(project: Project): Project {
  const db = readDB();
  const { v4: uuidv4 } = require('uuid');
  const newProject = { ...project, id: uuidv4() };
  db.projects.push(newProject);
  writeDB(db);
  return newProject;
}

export function getProjectById(id: string): Project | undefined {
  const db = readDB();
  return db.projects.find((p) => p.id === id);
}
export function updateProject(id: string, project: Project): Project | undefined {
  const db = readDB();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  db.projects[index] = project;
  writeDB(db);
  return db.projects[index];
}

export function deleteProject(id: string): boolean {
  const db = readDB();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.projects.splice(index, 1);
  writeDB(db);
  return true;
}
