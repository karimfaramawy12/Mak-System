
import { Priority, Status, Role, User, Department, Project, Task } from '../types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Marketing' },
  { id: 'dept-2', name: 'Sales' },
  { id: 'dept-3', name: 'Operations' },
  { id: 'dept-4', name: 'Customer Support' },
  { id: 'dept-5', name: 'Logistics' },
];

export const USERS: User[] = [
  { id: 'u-1', name: 'Karim', role: Role.ADMIN, deptId: 'dept-3' },
  { id: 'u-2', name: 'Bedawy', role: Role.MANAGER, deptId: 'dept-1' },
  { id: 'u-3', name: 'Haitham', role: Role.EMPLOYEE, deptId: 'dept-3' },
  { id: 'u-4', name: 'Shahd Fouad', role: Role.EMPLOYEE, deptId: 'dept-1' },
  { id: 'u-5', name: 'Mostafa Tarek', role: Role.EMPLOYEE, deptId: 'dept-2' },
  { id: 'u-6', name: 'Mohamed Tarek', role: Role.EMPLOYEE, deptId: 'dept-4' },
  { id: 'u-7', name: 'Hanafy', role: Role.EMPLOYEE, deptId: 'dept-5' },
];

export const PROJECTS: Project[] = [
  { id: 'p-1', name: 'Ds', deptId: 'dept-1', progress: 45 },
  { id: 'p-2', name: 'Mak', deptId: 'dept-5', progress: 12 },
  { id: 'p-3', name: 'Am', deptId: 'dept-2', progress: 85 },
];

export const TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Social Media Strategy Review',
    description: 'Review the upcoming Q4 campaign across Instagram and LinkedIn.',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    dueDate: '2025-01-20',
    assigneeId: 'u-4',
    projectId: 'p-1',
    deptId: 'dept-1',
    createdAt: '2024-11-01',
    tags: ['social', 'campaign'],
  },
  {
    id: 't-2',
    title: 'Inventory Audit',
    description: 'Full stock count of warehouse sector B.',
    priority: Priority.URGENT,
    status: Status.TODO,
    dueDate: '2025-01-15',
    assigneeId: 'u-1',
    projectId: 'p-2',
    deptId: 'dept-5',
    createdAt: '2024-11-05',
    tags: ['warehouse', 'audit'],
  },
  {
    id: 't-3',
    title: 'Client Onboarding Pack',
    description: 'Update PDF guides for new corporate clients.',
    priority: Priority.MEDIUM,
    status: Status.REVIEW,
    dueDate: '2025-01-18',
    assigneeId: 'u-5',
    projectId: 'p-3',
    deptId: 'dept-2',
    createdAt: '2024-11-10',
    tags: ['sales', 'onboarding'],
  },
  {
    id: 't-4',
    title: 'Finalize Logistics Partner',
    description: 'Review contracts with 3PL providers.',
    priority: Priority.HIGH,
    status: Status.TODO,
    dueDate: '2025-01-12',
    assigneeId: 'u-7',
    projectId: 'p-2',
    deptId: 'dept-5',
    createdAt: '2024-11-02',
    tags: ['logistics', 'vendor'],
  },
];
