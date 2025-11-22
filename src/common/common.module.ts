import { Module } from '@nestjs/common';
import { BcryptjsAdapter } from './adapters/bcrypt-js.adapter';

@Module({
  providers: [
    {
      provide: 'HashAdapter',
      useClass: BcryptjsAdapter,
    },
  ],
  exports: ['HashAdapter'],
})
export class CommonModule {}
