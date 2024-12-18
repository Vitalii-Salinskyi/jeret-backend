import { JobRolesEnum } from "src/interfaces/users";

export class UpdateUserDto {
  name?: string;
  profile_picture?: string;
  description?: string;
  job_role?: JobRolesEnum;
  is_online?: boolean;
  is_deleted?: boolean;
}
