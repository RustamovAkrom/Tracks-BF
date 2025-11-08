export interface ProfileType {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  subscription_type?: string;
  is_email_verified?: boolean;
  is_active?: boolean;
}
