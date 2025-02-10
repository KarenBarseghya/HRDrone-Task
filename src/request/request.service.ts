import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UsersService } from 'src/users/users.service';
import { Request, StatusEnum } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async sendRequest({
    getterId,
    senderId,
  }: CreateRequestDto): Promise<Request> {
    const getter = await this.userService.checkUserExists(getterId);
    const sender = await this.userService.checkUserExists(senderId);

    if (!getter || !sender) {
      throw new NotFoundException('User not found');
    }

    const request = await this.prisma.request.findFirst({
      where: { getterId, senderId },
    });

    if (request) {
      throw new ConflictException('Request already exists');
    }

    const requestReverse = await this.prisma.request.findFirst({
      where: { getterId: senderId, senderId: getterId },
    });

    if (requestReverse) {
      throw new ConflictException('Request already exists');
    }

    return this.prisma.request.create({
      data: { getterId, senderId },
    });
  }

  async acceptRequest(requestId: string): Promise<Request> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return this.prisma.request.update({
      where: { id: requestId },
      data: { status: StatusEnum.ACCEPTED },
    });
  }

  async deleteRequest(requestId: string): Promise<Request> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return this.prisma.request.delete({
      where: { id: requestId },
    });
  }

  async getUserFriends({ userId }: { userId: string }) {
    const user = await this.userService.checkUserExists(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRequests = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentRequests: {
          where: { status: StatusEnum.ACCEPTED },
          select: { getterId: true },
        },
        receivedRequests: {
          where: { status: StatusEnum.ACCEPTED },
          select: { senderId: true },
        },
      },
    });
    const requests = [
      ...userRequests.sentRequests.map((obj) => obj.getterId),
      ...userRequests.receivedRequests.map((obj) => obj.senderId),
    ];

    return requests;
  }

  async getUserRequestsOutGoing({ userId }: { userId: string }) {
    const user = await this.userService.checkUserExists(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRequests = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentRequests: {
          where: { status: StatusEnum.PENDING },
          select: { getterId: true },
        },
      },
    });
    const requests = [...userRequests.sentRequests.map((obj) => obj.getterId)];
    return requests;
  }

  async getUserRequestsInComing({ userId }: { userId: string }) {
    const user = await this.userService.checkUserExists(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRequests = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        receivedRequests: {
          where: { status: StatusEnum.PENDING },
          select: { senderId: true },
        },
      },
    });
    const requests = [
      ...userRequests.receivedRequests.map((obj) => obj.senderId),
    ];
    return requests;
  }
}
