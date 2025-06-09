import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { OzowService } from './ozow.service';
import { Request, Response } from 'express';

@Controller('ozow')
export class OzowController {
  constructor(private readonly ozowService: OzowService) {}

  @Post('initiate')
  async initiate(@Body() body: any) {
    return await this.ozowService.initiatePayment(body);
  }

  @Post('payment-failed')
  async paymentFailed(@Body() body: any) {
    return this.ozowService.handleFailed(body);
  }

  @Post('payment-cancelled')
  async paymentCancelled(@Body() body: any) {
    return this.ozowService.handleCancelled(body);
  }

  @Post('notify')
  async notify(@Body() body: any) {
    return this.ozowService.handleNotification(body);
  }

  @Post('success')
  async paymentSuccess(@Body() body: any) {
    return this.ozowService.handleSuccess(body);
  }
}
