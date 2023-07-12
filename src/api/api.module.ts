import { Module } from '@nestjs/common';
import { SubmitModule } from './submit/submit.module';

@Module({
  imports: [SubmitModule],
})
export class APIModule {}
