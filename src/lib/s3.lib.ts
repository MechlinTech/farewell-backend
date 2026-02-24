import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3.config.js';

export class S3Service {
  static async uploadFile(
    bucket: string,
    key: string,
    file: Express.Multer.File
  ) {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  }

  static async deleteFile(bucket: string, key: string) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
  }
}