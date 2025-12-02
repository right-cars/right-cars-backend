import { Module } from '@nestjs/common';
import { OzowController } from './ozow.controller';
import { OzowService } from './ozow.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OzowController],
  providers: [OzowService],
})
export class OzowModule {}
