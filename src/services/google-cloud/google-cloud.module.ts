import { Module } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';
import { UidModule } from '@services/uid/uid.module';

@Module({
  providers: [GoogleCloudService], // List of injectable services
  imports: [UidModule],
  exports: [GoogleCloudService], // List of injectable services you want to export to other modules
})
export class GoogleCloudModule { }
