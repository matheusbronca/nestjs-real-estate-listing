import { app, listingQueue } from '../../../test/setup';
import { ListingService } from './listing.service';
import { DrizzleDB } from '@database/drizzle-db';
import { DATABASE_CONNECTION } from '@database/database-tokens';
import {
  generatePayload,
  generateImage,
  generateImages,
} from './__test__/test-utils';
import { listingImages, listings } from './schema';
import { eq } from 'drizzle-orm';
import { FileService } from '../../utils/file/file.service';

describe('ListingService Integration Tests', () => {
  let listingService: ListingService;
  let dbService: DrizzleDB;
  let fileService: FileService;

  beforeEach(() => {
    listingService = app.get<ListingService>(ListingService);
    dbService = app.get<DrizzleDB>(DATABASE_CONNECTION);
    fileService = app.get<FileService>(FileService);
  });

  describe('create', () => {
    it('should create a listing (no images)', async () => {
      const payload = generatePayload();
      const result = await listingService.create({ data: payload, images: [] });

      const dbRecord = await dbService
        .select()
        .from(listings)
        .where(eq(listings.id, result.id))
        .limit(1);

      expect(dbRecord).toBeTruthy();
      expect([result]).toEqual(dbRecord);
    });

    it('should create a listing (with images)', async () => {
      const payload = generatePayload();

      const images = generateImages();
      const result = await listingService.create({ data: payload, images });
      let inProcessJobs = await listingQueue.getJobs(['active']);

      while (inProcessJobs.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        inProcessJobs = await listingQueue.getJobs(['active']);
      }

      const dbRecord = await dbService
        .select()
        .from(listings)
        .where(eq(listings.id, result.id))
        .limit(1);

      const imgDbRecords = await dbService
        .select()
        .from(listingImages)
        .where(eq(listingImages.listingId, dbRecord[0]!.id));

      expect(dbRecord).toBeTruthy();
      expect([result]).toEqual(dbRecord);
      expect(imgDbRecords.length).toBe(3);
    });
  });

  describe('createListingImage', () => {
    it('should create a listing image', async () => {
      const payload = generatePayload();
      const listing = await listingService.create({
        data: payload,
        images: [],
      });

      const { buffer, mimeType } = generateImage();
      const base64String = fileService.bufferToBase64(buffer);

      const result = await listingService.createListingImage({
        base64String,
        mimeType,
        listingId: listing.id,
      });

      const mockedResult = {
        url: 'https://storage.googleapis.com/image-url',
        listingId: listing.id,
      };
      expect(result[0]?.url).toEqual(mockedResult.url);
      expect(result[0]?.listingId).toEqual(mockedResult.listingId);
    });
  });
});
