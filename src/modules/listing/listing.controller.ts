import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MaxFileCountPipe } from '../../common/pipes/max-file-count/max-file-count.pipe';

export type CreateReturnType = ReturnType<ListingService['create']>;

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createListingDto: CreateListingDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
            skipMagicNumbersValidation: process.env.NODE_ENV === 'test',
          }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024, // 1MB
          }),
        ],
      }),
      new MaxFileCountPipe(10),
    )
    images: Express.Multer.File[],
  ): CreateReturnType {
    return this.listingService.create({
      data: createListingDto,
      images,
    });
  }
}
