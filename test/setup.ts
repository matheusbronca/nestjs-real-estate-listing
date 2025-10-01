import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import { DATABASE_CONNECTION } from '@database/database-tokens';
import { DrizzleDB } from '@database/drizzle-db';
import { CacheService } from '@core/cache/cache.service';
import { GoogleCloudService } from '@services/google-cloud/google-cloud.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { LISTING_QUEUE } from '@core/queue/queue.constants';

let app: INestApplication<App>;
let server: App;
let cacheService: CacheService;
let databaseService: DrizzleDB;
let googleCloudService: DeepMocked<GoogleCloudService>;
let listingQueue: Queue;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: GoogleCloudService,
        useValue: createMock<GoogleCloudService>(),
      },
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();

  server = app.getHttpServer();
  cacheService = app.get(CacheService);
  databaseService = app.get(DATABASE_CONNECTION);

  googleCloudService = moduleFixture.get(GoogleCloudService);
  googleCloudService.uploadFile = jest
    .fn()
    .mockReturnValue('https://storage.googleapis.com/image-url');

  listingQueue = moduleFixture.get<Queue>(`BullQueue_${LISTING_QUEUE.name}`);
});

beforeEach(async () => {
  await cacheService.reset();
  await databaseService.reset();
});

afterAll(async () => {
  await listingQueue.obliterate({ force: true });
  await app.close();
});

export { server, app, listingQueue };
