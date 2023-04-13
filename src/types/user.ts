export interface ViewUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UsersResponse {
  users: ViewUser[];
}