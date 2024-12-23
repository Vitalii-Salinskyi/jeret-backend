import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl, Length } from "class-validator";

import { JobRolesEnum } from "src/interfaces/users";

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Length(1)
  name?: string;

  @IsOptional()
  @IsUrl()
  profile_picture?: string;

  @IsOptional()
  @IsString()
  @Length(50)
  description?: string;

  @IsOptional()
  @IsEnum(JobRolesEnum)
  job_role?: JobRolesEnum;

  @IsOptional()
  @IsBoolean()
  is_online?: boolean;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
