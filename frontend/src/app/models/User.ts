export interface User {
  id: number | null;
  username: string;
  password: string;
}

export interface UserReceived {
  username: string;
}
