export interface TaskStatus {
  pending: number;
  progress: number;
  completed: number;
  review: number;
}

export interface IProject {
  id: number;
  created_at: string;
  name: string;
  members_count: number;
  status: TaskStatus;
  owner_id: number;
}
