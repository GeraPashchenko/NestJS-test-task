import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from './interface/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) { }

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
    }

    const token = req.headers.authorization.split(' ')[1].replace(/"/g, '');

    try {
      const decode = verify(
        token,
        this.configService.get('app-env.jwt_secret'),
      );

      if (typeof decode === 'object') {
        const user = await this.userService.findById(decode.id);
        req.user = user;
        next();
      }
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
