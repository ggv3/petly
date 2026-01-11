import bcrypt from 'bcrypt';
import { PASSWORD } from 'constants.js';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, PASSWORD.SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
