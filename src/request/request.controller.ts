import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AcceptRequestDto } from './dto/accept-request.dto';
import { DeleteRequestDto } from './dto/delete-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from '@prisma/client';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('send')
  async sendRequest(
    @Body() createRequestDto: CreateRequestDto,
  ): Promise<Request> {
    return this.requestService.sendRequest(createRequestDto);
  }

  @Post('accept')
  async acceptRequest(
    @Body() acceptRequestDto: AcceptRequestDto,
  ): Promise<Request> {
    return this.requestService.acceptRequest(acceptRequestDto.requestId);
  }

  @Delete('delete')
  async deleteRequest(
    @Body() deleteRequestDto: DeleteRequestDto,
  ): Promise<Request> {
    return this.requestService.deleteRequest(deleteRequestDto.requestId);
  }

  @Get('friends/:userId')
  async getUserFriends(@Param('userId') userId: string): Promise<string[]> {
    return this.requestService.getUserFriends({ userId });
  }

  @Get('outgoing/:userId')
  async getUserRequestsOutGoing(
    @Param('userId') userId: string,
  ): Promise<string[]> {
    return this.requestService.getUserRequestsOutGoing({ userId });
  }

  @Get('incoming/:userId')
  async getUserRequestsInComing(
    @Param('userId') userId: string,
  ): Promise<string[]> {
    return this.requestService.getUserRequestsInComing({ userId });
  }
}
