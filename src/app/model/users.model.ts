import { Role } from "./role.models";


export class User {
  id?: number;
  email?: string;
  passwordHash?: string;
  role!: Role;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}