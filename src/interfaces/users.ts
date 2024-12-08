export enum JobRoles {
  ProjectManager = "Project Manager",
  FrontendDeveloper = "Front-end Developer",
  BackendDeveloper = "Back-end Developer",
  WebDeveloper = "Web Developer",
  AndroidDeveloper = "Android Developer",
  IOSDeveloper = "IOS Developer",
  UIUXDesigner = "UI/UX Design",
  ThreeDDesigner = "3D Design",
  TwoDDesigner = "2D Design",
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  job_role?: string;
  password?: string;
  google_id?: string;
  profile_completed: boolean;
  tasks_completed: number;
  tasks_pending: number;
  is_online: boolean;
  followers_count: number;
  followed: number;
  rating: number;
  review_count: number;
  is_deleted: boolean;
  created_at: Date;
}
