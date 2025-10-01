import { TypedConfigService } from '@config';
import { Storage } from '@google-cloud/storage';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UidService } from '@services/uid/uid.service';

@Injectable()
export class GoogleCloudService implements OnModuleInit {
  private storage: Storage;
  constructor(
    private readonly configService: TypedConfigService,
    private readonly uidService: UidService,
  ) { }

  onModuleInit() {
    this.storage = new Storage({
      projectId: this.configService.getOrThrow('gcp.projectId', {
        infer: true,
      }),
      credentials: {
        client_email: this.configService.getOrThrow('gcp.clientEmail', {
          infer: true,
        }),
        private_key: this.configService.getOrThrow('gcp.privateKey', {
          infer: true,
        }),
      },
    });
  }

  async uploadFile(bucketName: string, buffer: Buffer, mimeType: string) {
    // upload the file to GCP
    const bucket = this.storage.bucket(bucketName);
    const fileName = this.uidService.generate(); // TODO: Generate a random file name;
    const file = bucket.file(fileName); // Prepares the file to be uploaded
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
      gzip: true,
    });
    // return the public url of the respective file/image
    await file.makePublic();
    return file.publicUrl();
  }
}
