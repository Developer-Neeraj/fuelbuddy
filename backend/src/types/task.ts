export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface users {
  id: string;
  email: string;
  username: string;
  firebaseuserid: string;
  created_at: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: Date;
  user_id: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  shareid?: string;
  user_id?: string;
  id?: string;
}