import { BaseQueueConsumer } from '@core/queue/base.consumer';
import { LISTING_QUEUE } from '@core/queue/queue.constants';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateListingImageDto } from '../dto/create-listing-image.dto';
import { ListingService } from '../listing.service';

const {
  name: QUEUE,
  methods: { CREATE_LISTING_IMAGE },
} = LISTING_QUEUE;

@Processor(QUEUE)
export class ListingConsumer extends BaseQueueConsumer {
  constructor(private readonly listingService: ListingService) {
    super();
  }

  @Process(CREATE_LISTING_IMAGE)
  async createListingImage(job: Job<CreateListingImageDto>) {
    await this.listingService.createListingImage(job.data);
  }
}
