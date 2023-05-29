import { Global, Module } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'HashService',
      useClass: HashService,
    },

    ConfigService,
  ],
  exports: [HashService],
  imports: [],
})
export class HashModule {}
