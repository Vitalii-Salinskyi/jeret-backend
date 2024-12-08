import { JobRoles } from "src/interfaces/users";

export class UpdateUserDto {
  name?: string;
  profile_picture?: string;
  job_role?: JobRoles;
  profile_completed: boolean;
  is_online: boolean;
  is_deleted: boolean;
}
