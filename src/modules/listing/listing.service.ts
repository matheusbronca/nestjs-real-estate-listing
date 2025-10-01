import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { DATABASE_CONNECTION } from '@database/database-tokens';
import { DrizzleDB } from '@database/drizzle-db';

import { ListingProducer } from './queue/listing.producer';
import { FileService } from '../../utils/file/file.service';
import { TypedConfigService } from '@config';
import { CreateListingImageDto } from './dto/create-listing-image.dto';
import { GoogleCloudService } from '@services/google-cloud/google-cloud.service';

import { listings, listingImages } from './schema';

@Injectable()
export class ListingService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DrizzleDB,
    private readonly listingProducer: ListingProducer,
    private readonly fileService: FileService,
    private readonly configService: TypedConfigService,
    private readonly gcpService: GoogleCloudService,
  ) {}

  async create({
    data,
    images,
  }: {
    data: CreateListingDto;
    images: Express.Multer.File[];
  }) {
    const listingData = await this.db
      .insert(listings)
      .values({
        ...data,
      })
      .returning();

    const listing = listingData?.[0];

    if (!listing?.id) throw new NotFoundException();

    // file type should be .png/jpg/jpeg
    // file size should be max 1MB
    // the images length should be max of 10 images
    for (const image of images) {
      // Convert image buffer to a base64String

      // send image to the queue
      await this.listingProducer.createListingImage({
        base64String: this.fileService.bufferToBase64(image.buffer),
        mimeType: image.mimetype,
        listingId: listing.id,
      });
    }

    return listing;
  }

  async createListingImage({
    base64String,
    mimeType,
    listingId,
  }: CreateListingImageDto) {
    const imageBuffer = this.fileService.base64ToBuffer(base64String);
    const bucketName = this.configService.getOrThrow(
      'gcp.buckets.listingImages',
      { infer: true },
    );

    // Here is where the job is processed;
    // upload the file to GCP
    // - File Buffer
    // - Mime Type
    const publicImageUrl = await this.gcpService.uploadFile(
      bucketName,
      imageBuffer,
      mimeType,
    );

    // Save the reference file to the database
    // - Public URL of the image (from GCS -> Google Cloud Storage);
    // - The relation to the listing (listingId);
    return await this.db
      .insert(listingImages)
      .values({
        url: publicImageUrl,
        listingId: listingId,
      })
      .returning();
  }
}
