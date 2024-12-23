import { IsIP, IsLatitude, IsLongitude, IsString } from "class-validator";

export class CreateSessionDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  long: number;

  @IsString()
  device: string;

  @IsIP()
  ip_address: string;
}
