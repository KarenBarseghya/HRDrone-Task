import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        age: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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

  async getUsers({
    name,
    surname,
    minAge,
    maxAge,
  }): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      where: {
        ...(name && { name: { contains: name } }),
        ...(surname && { surname: { contains: surname } }),
        ...(minAge && { age: { gte: minAge } }),
        ...(maxAge && { age: { lte: maxAge } }),
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        age: true,
      },
    });
  }
}
