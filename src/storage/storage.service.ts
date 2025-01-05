import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Readable } from "stream";

@Injectable()
export class StorageService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>("AWS_S3_REGION"),
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(key: string, file: ArrayBuffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: "jeret",
          Key: key,
          Body: new Uint8Array(file),
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async getFile(fileName: string): Promise<Buffer> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: "jeret",
          Key: fileName,
        }),
      );

      const chunks: Buffer[] = [];

      for await (const chunk of response.Body as Readable) {
        chunks.push(chunk as Buffer);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      throw error;
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: "jeret",
        Key: key,
      });
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

      return url;
    } catch (error) {
      throw error;
    }
  }
}
