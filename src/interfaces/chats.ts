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
