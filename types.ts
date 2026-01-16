
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum Status {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export enum Role {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
  VIEWER = 'Viewer'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  deptId: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  deptId: string;
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assigneeId: string;
  projectId: string;
  deptId: string;
  createdAt: string;
  tags: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'status' | 'alert' | 'comment';
  timestamp: string;
  read: boolean;
  taskId?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  timestamp: string;
}
