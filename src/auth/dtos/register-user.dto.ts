export class RegisterUserDto {
  name: string;
  email: string;
  profile_picture: string;
  password?: string;
  google_id?: string;
}
