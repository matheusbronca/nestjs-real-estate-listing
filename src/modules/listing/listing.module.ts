import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { BullModule } from '@nestjs/bull';
import { ListingProducer } from './queue/listing.producer';
import { ListingConsumer } from './queue/listing.consumer';
import { LISTING_QUEUE } from '@core/queue/queue.constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { UtilsModule } from '../../utils/utils.module';
import { GoogleCloudModule } from '@services/google-cloud/google-cloud.module';

const { name: QUEUE } = LISTING_QUEUE;

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE }),
    BullBoardModule.forFeature({ name: QUEUE, adapter: BullAdapter }),
    UtilsModule,
    GoogleCloudModule,
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingProducer, ListingConsumer],
})
export class ListingModule { }
