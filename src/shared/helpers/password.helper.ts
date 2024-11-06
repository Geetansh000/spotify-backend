import * as bcrypt from 'bcryptjs';
import { hash } from 'crypto';
import { bcryptConstant } from '../constants';

export const hashPassword = async (password: string):Promise<string> => {
  const salt = bcryptConstant.SALT;

  return await bcrypt.hash(password, salt);
};

export const comparePasswords = (
  password: string,
  hashValue: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashValue);
};
