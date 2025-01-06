export interface UserChat {
  id: number;
  chat_id: number;
  user_id: number;
  name: string;
  job_role: string;
  profile_picture: string;
  last_message: LastMessage;
}

export interface LastMessage {
  seen: boolean;
  message: string;
  sender_id: number;
  created_at: Date;
}

export interface ClientMessage {
  created_at: string;
  message: string;
  sender_id: number;
  chat_id: number;
  seen?: boolean;
  id: number;
}

export interface IFile {
  id: number;
  sender_id: number;
  message_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_path: string;
  uploaded_at: string;
}

export interface IFileDto extends IFile {
  buffer: ArrayBuffer;
}
