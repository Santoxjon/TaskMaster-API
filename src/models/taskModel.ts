export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export const VALID_TASK_STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}
