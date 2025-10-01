import { LISTING_QUEUE } from '@core/queue/queue.constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateListingImageDto } from '../dto/create-listing-image.dto';

const {
  name: QUEUE,
  methods: { CREATE_LISTING_IMAGE },
} = LISTING_QUEUE;

@Injectable()
export class ListingProducer {
  constructor(@InjectQueue(QUEUE) private readonly queue: Queue) { }

  async createListingImage(payload: CreateListingImageDto) {
    return await this.queue.add(CREATE_LISTING_IMAGE, payload);
  }
}
