import { join } from 'path';
import { CreateListingDto } from '../dto/create-listing.dto';
import { readFileSync } from 'fs';

export const generatePayload: () => CreateListingDto = () => ({
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
});

export const generateImage = () => {
  const imagePath = join(__dirname, './images/test-img.jpg');
  const buffer = readFileSync(imagePath);
  return {
    buffer,
    mimeType: 'image/jpg',
  };
};

export const generateImages = () => {
  const imagePath = join(__dirname, './images/test-img.jpg');
  const imagePath2 = join(__dirname, './images/test-img2.jpg');
  const imagePath3 = join(__dirname, './images/test-img3.jpg');

  const buffer1 = readFileSync(imagePath);
  const img1 = {
    buffer: buffer1,
    mimetype: 'image/jpg',
  } as Express.Multer.File;

  const buffer2 = readFileSync(imagePath2);
  const img2 = {
    buffer: buffer2,
    mimetype: 'image/jpg',
  } as Express.Multer.File;
  const buffer3 = readFileSync(imagePath3);
  const img3 = {
    buffer: buffer3,
    mimetype: 'image/jpg',
  } as Express.Multer.File;

  return [img1, img2, img3];
};
