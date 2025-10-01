import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { listings } from '../schema';
import { InferSelectModel } from 'drizzle-orm';

export class CreateListingImageDto {
  @IsString()
  @IsNotEmpty()
  base64String: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsInt()
  listingId: InferSelectModel<typeof listings>['id'];
}
