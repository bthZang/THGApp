import { S3 } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import mime from 'mime-types';

import { type IFile } from '../../interfaces';
import { ApiConfigService } from './api-config.service';
import { GeneratorService } from './generator.service';

export interface IAwsS3Service {
  uploadImage(file: IFile, folderName: string): Promise<string>;
  getImageUrl(imageId: string): string;
}

@Injectable()
export class AwsS3Service implements IAwsS3Service {
  private readonly s3: S3;

  constructor(
    public configService: ApiConfigService,
    public generatorService: GeneratorService,
  ) {
    const awsS3Config = configService.awsS3Config;

    this.s3 = new S3({
      apiVersion: awsS3Config.bucketApiVersion,
      region: awsS3Config.bucketRegion,
      credentials: {
        accessKeyId: awsS3Config.accessKeyId,
        secretAccessKey: awsS3Config.secretAccessKeyId,
      },
    });
  }

  async uploadImage(file: IFile, folderName: string): Promise<string> {
    const fileName = this.generatorService.fileName(<string>mime.extension(file.mimetype));
    const key = `${folderName}/${fileName}`;

    try {
      await this.s3.putObject({
        Bucket: this.configService.awsS3Config.bucketName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Key: key,
      });
    } catch {
      throw new InternalServerErrorException('Cannot upload image');
    }

    return key;
  }

  getImageUrl(imageId: string): string {
    const imageUrl = `https://${this.configService.awsS3Config.bucketName}.s3.amazonaws.com/${imageId}`;

    return imageUrl;
  }
}
