import { Role } from "../model/role.models";
import { User } from "../model/users.model";

const transporter1: User = {
  id: 13,
  email: 'jean@mail.com',
  passwordHash: 't1',
  firstName: 'Jean',
  lastName: 'Mbappe',
  phone: '+49 176 1234567',
  role: Role.TRANSPORTER,
  isActive: true,
  emailVerified: true
};

const transporter2: User = {
  id: 2,
  email: 'sophie@mail.com',
  passwordHash: 't2',
  firstName: 'Sophie',
  lastName: 'Ngono',
  phone: '+33 612345678',
  role: Role.ADMIN,
  isActive: true,
  emailVerified: true
};

export const USERS_LIST: User [] = [ transporter1 , transporter2 ]