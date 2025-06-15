import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.isActive) {
        throw new UnauthorizedException('Conta desativada');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshToken(refreshTokenString: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenString, revoked: false },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    refreshToken.revoked = true;
    await this.refreshTokenRepository.save(refreshToken);

    const payload = { 
      email: refreshToken.user.email, 
      sub: refreshToken.user.id, 
      role: refreshToken.user.role 
    };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.generateRefreshToken(refreshToken.user);

    return {
      accessToken,
      refreshToken: newRefreshToken.token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      return { message: 'Se o email existir, você receberá um link de recuperação' };
    }

    await this.passwordResetTokenRepository.update(
      { user: { id: user.id }, used: false },
      { used: true }
    );

    const resetToken = new PasswordResetToken();
    resetToken.token = uuidv4();
    resetToken.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    resetToken.user = user;

    await this.passwordResetTokenRepository.save(resetToken);

    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken.token}`;
    
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de Senha',
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Olá ${user.name},</p>
        <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        <p>Este link expira em 15 minutos.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      `,
    });

    return { message: 'Email de recuperação enviado' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token: resetPasswordDto.token, used: false },
      relations: ['user'],
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);
    await this.usersService.updatePassword(resetToken.user.id, hashedPassword);

    resetToken.used = true;
    await this.passwordResetTokenRepository.save(resetToken);

    await this.refreshTokenRepository.update(
      { user: { id: resetToken.user.id }, revoked: false },
      { revoked: true }
    );

    return { message: 'Senha redefinida com sucesso' };
  }

  async logout(refreshTokenString: string) {
    await this.refreshTokenRepository.update(
      { token: refreshTokenString },
      { revoked: true }
    );
    return { message: 'Logout realizado com sucesso' };
  }

  private async generateRefreshToken(user: User): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.token = uuidv4();
    refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
    refreshToken.user = user;

    return await this.refreshTokenRepository.save(refreshToken);
  }
}