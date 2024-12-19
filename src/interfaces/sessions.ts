export interface ISession {
  id: number;
  userId: number;
  ip_address: string;
  device: string;
  location: string;
  created_at: Date;
  expires_at: Date;
}
