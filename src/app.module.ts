import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { ListingModule } from './modules/listing/listing.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [CoreModule, DatabaseModule, ListingModule, UtilsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
