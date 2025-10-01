import { Test, TestingModule } from '@nestjs/testing';
import { ListingService } from './listing.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { DATABASE_CONNECTION } from '@database/database-tokens';
import { DrizzleDB } from '@database/drizzle-db';
import { CreateListingDto } from './dto/create-listing.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { GoogleCloudService } from '@services/google-cloud/google-cloud.service';

describe('ListingService', () => {
  let listingService: ListingService;
  let db: DeepMockProxy<DrizzleDB>;
  let gcpService: DeepMocked<GoogleCloudService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDeep<DrizzleDB>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    listingService = module.get<ListingService>(ListingService);
    db = module.get(DATABASE_CONNECTION);
    gcpService = module.get(GoogleCloudService);
  });

  it('should be defined', () => {
    expect(listingService).toBeDefined();
  });

  it('should create a listing', async () => {
    // when using the create() method, it should return the respective database record
    const payload = {
      label: 'Spacious Apartment in Downtown',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressZipCode: '62704',
      addressCity: 'Springfield',
      addressState: 'UN',
      price: 150000,
      bathrooms: 2,
      bedrooms: 3,
      squareMeters: 120,
    } as CreateListingDto;

    const mockedResponse = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    };

    jest.spyOn(db, 'insert').mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockedResponse]),
      }),
    } as any);

    const res = await listingService.create({ data: payload, images: [] });
    expect(res).toEqual(mockedResponse);
  });

  describe('createListingImage', () => {
    it('should return the respective listing image entry', async () => {
      const publicUrl =
        'https://storage.googleapis.com/listing-images-bucket/random-uid';

      gcpService.uploadFile.mockResolvedValueOnce(publicUrl);

      const payload = {
        listingId: 1,
        mimeType: 'image/png',
        base64String: 'SGVsbG8sIFdvcmxkIQ=',
      };

      const mockedDbResponse = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: publicUrl,
        listingId: payload.listingId,
      };

      jest.spyOn(db, 'insert').mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce(mockedDbResponse),
        }),
      } as any);

      const result = await listingService.createListingImage(payload);
      expect(result).toEqual(mockedDbResponse);
    });
  });
});
