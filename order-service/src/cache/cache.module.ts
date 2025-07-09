import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';

@Module({
  controllers: [CacheController],
  providers: [
    CacheService,
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv('redis://user:pass@localhost:6379');
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
  ],
  exports: ['CACHE_INSTANCE'],
})
export class CacheModule {}
