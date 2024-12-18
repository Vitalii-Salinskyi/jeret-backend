export enum JobRolesEnum {
  ProjectManager = "Project Manager",
  FrontendDeveloper = "Front-end Developer",
  BackendDeveloper = "Back-end Developer",
  WebDeveloper = "Web Developer",
  AndroidDeveloper = "Android Developer",
  IOSDeveloper = "IOS Developer",
  UIUXDesigner = "UI/UX Designer",
  ThreeDDesigner = "3D Designer",
  TwoDDesigner = "2D Designer",
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  description?: string;
  job_role?: JobRolesEnum;
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

export type UserSortType = "followers_count" | "tasks_completed" | "rating" | "review_count";
