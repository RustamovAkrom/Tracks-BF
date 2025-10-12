export interface TokenResponseType {
  access: string;
  refresh: string;
}

export interface LoginPayloadType {
  username: string;
  password: string;
}

export interface RegisterPayloadType {
  username: string;
  email: string;
  password: string;
  password2: string;
}
