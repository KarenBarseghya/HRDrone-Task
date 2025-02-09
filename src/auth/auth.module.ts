import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'your_secret_key', // Change this to an environment variable in production
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
  ], // ✅ Import PrismaModule
  controllers: [AuthController],
  providers: [AuthService, JwtModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
