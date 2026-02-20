import crypto from 'crypto';
import path from 'path';
import { env } from '../config/env.config.js';

export function generateFileName(originalName: string) {
  return `${crypto.randomUUID()}${path.extname(originalName)}`;
}

export function buildS3Key(folder: string, fileName: string) {
  return `${folder}/${fileName}`;
}

export function constructPublicUrl(key: string) {
  return `https://${env.PUBLIC_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}