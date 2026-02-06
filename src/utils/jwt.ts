import jwt from 'jsonwebtoken';
import type { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';

const JWT_SECRET = env.jwt_secret as string;
const JWT_REFRESH_SECRET = env.jwt_refresh_secret as string;
const JWT_EXPIRES_IN = (env.jwt_expires_in ?? '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (env.jwt_refresh_expires_in ?? '7d') as SignOptions['expiresIn'];

export interface AppJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function signAccessToken(payload: AppJwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function signRefreshToken(payload: AppJwtPayload): string {
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AppJwtPayload {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options: VerifyOptions = {
    algorithms: ['HS256'],
  };

  return jwt.verify(token, JWT_SECRET, options) as AppJwtPayload;
}

export function verifyRefreshToken(token: string): AppJwtPayload {
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  const options: VerifyOptions = {
    algorithms: ['HS256'],
  };

  return jwt.verify(token, JWT_REFRESH_SECRET, options) as AppJwtPayload;
}
