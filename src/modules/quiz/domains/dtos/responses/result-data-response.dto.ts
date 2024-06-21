import { IsString } from 'class-validator';

export class ResultResponseDto {
  @IsString()
  imgURL!: string;

  @IsString()
  imageId!: string;

  @IsString()
  imageCacheId!: string;

  constructor(imgURL: string, imageId: string, imageCacheId: string) {
    this.imageId = imageId;
    this.imageCacheId = imageCacheId;
    this.imgURL = imgURL;
  }
}
