export interface Comment {
  id: number;
  created_at: Date;
  payload: string;
  user: {
    avatar: string | null;
    username: string;
  };
}
