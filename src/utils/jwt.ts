import jwt from 'jsonwebtoken';
import type { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

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
