export interface Comment {
  id: number;
  created_at: Date;
  payload: string;
  edited: boolean;
  user: {
    avatar: string | null;
    username: string;
  };
}

export interface User {
  username: string;
  avatar: string | null;
}
