import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { TypedConfigService } from '@config';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: TypedConfigService) => {
        const host = configService.get('redis.host', { infer: true });
        const port = configService.get('redis.port', { infer: true });
        const username = configService.get('redis.username', { infer: true });
        const password = configService.get('redis.password', { infer: true });

        return {
          redis: {
            host,
            port,
            username,
            password,
          },
        };
      },
      inject: [TypedConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queue',
      adapter: ExpressAdapter,
    }),
  ],
})
export class QueueModule {}
