import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('test-db')
  async testDatabase() {
    try {
      const users = await this.prisma.user.findMany(); // Fetch all users
      return { success: true, users };
    } catch (error) {
      return { success: false, message: 'Database connection failed', error };
    }
  }
}
