import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

dotenv.config();

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['email', 'profile'],
      authorizationURL: '',
      tokenURL: '',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const user: User = await this.userService.findOrCreateByEmail(
      profile._json.email,
    );
    const access_token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    // return {
    //   id: user.id,
    //   email: user.email,
    //   type: user.type,
    //   access_token: access_token,
    // };
    return access_token;
  }
}
