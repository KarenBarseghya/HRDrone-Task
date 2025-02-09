import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUsersDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      new NotFoundException('User not found');
    }

    return user;
  }

  async checkUserExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!user;
  }

  async getUsers({ name, surname, minAge, maxAge }: GetUsersDto) {
    return this.prisma.user.findMany({
      where: {
        ...(name && { name: { contains: name } }),
        ...(surname && { surname: { contains: surname } }),
        ...(minAge && { age: { gte: minAge } }),
        ...(maxAge && { age: { lte: maxAge } }),
      },
    });
  }
}
