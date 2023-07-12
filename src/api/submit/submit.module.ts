import { Module } from '@nestjs/common';
import { SubmitController } from './submit.controller';
import { SubmitService } from './submit.service';

@Module({
  controllers: [SubmitController],
  providers: [SubmitService],
  exports: [SubmitService],
})
export class SubmitModule {}
