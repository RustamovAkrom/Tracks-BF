export interface MeType {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
  avatar?: string | null;
}