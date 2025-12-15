import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User, UserSchema } from '../users/entities/user.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '90d' }, // 90 días como apps deportivas (Strava, Nike Run Club, etc.)
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
