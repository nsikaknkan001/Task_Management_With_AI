export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'COMPLETED';
  dueDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId?: number;
  reminderSent?: boolean;
  roadmap?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: Date | string;
  roadmap?: string;
}