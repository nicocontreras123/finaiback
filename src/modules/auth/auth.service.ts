import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from '../users/entities/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (googleClientId) {
      this.googleClient = new OAuth2Client(googleClientId);
      console.log('✅ Google OAuth initialized');
    } else {
      console.log('⚠️ Google OAuth not configured');
    }
  }

  async signup(signupDto: SignupDto) {
    const { email, password, name } = signupDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      authProvider: 'email',
    });

    await user.save();

    const token = this.generateToken(user);

    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user);

    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    const { idToken } = googleAuthDto;

    if (!this.googleClient) {
      throw new Error('Google OAuth no configurado');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token de Google inválido');
      }

      const { email, sub: googleId, name } = payload;

      let user = await this.userModel.findOne({
        $or: [{ email }, { googleId }],
      });

      if (!user) {
        user = new this.userModel({
          email,
          googleId,
          name,
          authProvider: 'google',
        });
        await user.save();
      } else if (!user.googleId) {
        user.googleId = googleId;
        if (!user.authProvider || user.authProvider === 'email') {
          user.authProvider = 'google';
        }
        await user.save();
      }

      const token = this.generateToken(user);

      return {
        access_token: token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      throw new UnauthorizedException('Autenticación con Google fallida');
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.userModel.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '90d', // 90 días como apps deportivas
    });
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}
