import * as bcrypt from 'bcryptjs';
// import { SALT } from '../../shared/constant';

// export const hashPassword = (password: string) => {
//   return hash(password, SALT);
// };

export const comparePasswords = (password: string, hashValue: string): Promise<boolean> => {
  return bcrypt.compare(password, hashValue);
};
