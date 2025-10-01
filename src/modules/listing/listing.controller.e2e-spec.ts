import * as request from 'supertest';
import { server } from '../../../test/setup';
import { generatePayload } from './__test__/test-utils';
import { join } from 'path';
import { CreateReturnType } from './listing.controller';

describe('ListingController (e2e)', () => {
  describe('POST /listing', () => {
    const {
      label,
      price,
      bedrooms,
      bathrooms,
      addressCity,
      addressLine1,
      addressLine2,
      addressState,
      squareMeters,
      addressZipCode,
    } = generatePayload();

    const imagePath = join(__dirname, './__test__/images/test-img.jpg');

    it('valid payload should return a 201 and respective listing', async () => {
      await request(server)
        .post('/listing')
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2!)
        .field(`addressZipCode`, addressZipCode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, price)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach('images', imagePath)
        .expect(201)
        .expect((res: { body: { data: Awaited<CreateReturnType> } }) => {
          const { data } = res.body;
          expect(data.label).toEqual(label);
          expect(data.addressLine1).toEqual(addressLine1);
          expect(data.addressLine2).toEqual(addressLine2);
          expect(data.addressCity).toEqual(addressCity);
          expect(data.addressState).toEqual(addressState);
          expect(data.addressZipCode).toEqual(addressZipCode);
          expect(data.price).toEqual(price);
          expect(data.bathrooms).toEqual(bathrooms);
          expect(data.bedrooms).toEqual(bedrooms);
          expect(data.squareMeters).toEqual(squareMeters);
        });
    });

    it('should return a 400 if the payload is missing a required property', async () => {
      await request(server).post('/listing').expect(400);
    });

    it('should return 400 if the the price is not a number', async () => {
      await request(server)
        .post('/listing')
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2!)
        .field(`addressZipCode`, addressZipCode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, '$100,000.00')
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach('images', imagePath)
        .expect(400);
    });

    it('should return 400 if the attached images length is bigger than 10', async () => {
      await request(server)
        .post('/listing')
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2!)
        .field(`addressZipCode`, addressZipCode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, price)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .attach('images', imagePath)
        .expect(400);
    });

    it('should return 400 if no image is passed in', async () => {
      await request(server)
        .post('/listing')
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2!)
        .field(`addressZipCode`, addressZipCode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, price)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .expect(400);
    });
  });
});
