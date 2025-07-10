import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LocalAuthGuard } from './local/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { OAuth2Guard } from './oauth2/oauth2.guard';
import { Request as ExRequest, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(OAuth2Guard)
  @Get('/google/login')
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @UseGuards(OAuth2Guard)
  @Get('/google/callback')
  handleRedirect(@Req() req: ExRequest | any, @Res() res: Response) {
    res.cookie('access_token', req.user, {
      httpOnly: false,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:5173');
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
