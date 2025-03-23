export interface BaseModel {
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthModel {
  access_token: string;
  refreshToken?: string;
}

export interface TicketModel extends BaseModel {
  creator: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assigned_to: string;
}

export interface UserModel extends BaseModel {
  _id: string;
  email: string;
  first_name: string;
  last_name?: string;
  role?: string;
  tickets?: TicketModel[];
}
