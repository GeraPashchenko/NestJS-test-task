import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserEntity } from './entity/user.entity';
import { LoggedInUserDto } from './dto/logged-in-user.interface';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) { }

  /**
   * @async
   * Create a new user
   * @param createUserDto - user dto
   * @returns created user
   */
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username has taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  /**
   * @async
   * Find user by id
   * @param id - user's id
   * @returns found user
   */
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id, {
      relations: ['services'],
    });

    if (!user) {
      throw new HttpException('Wrong id', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  /**
   * @async
   * Get User's subscriptions
   * @param id - user's id
   * @returns user's subscriptions
   */
  async getUsersSubscriptions(id: number): Promise<ServiceEntity[]> {
    const user = await this.findById(id);

    if (!user.services.length) {
      throw new HttpException('User has no subscribes', HttpStatus.BAD_REQUEST);
    }

    return user.services;
  }

  /**
   * Generate JWT token
   * @param user - user entity
   * @returns jwt token string
   */
  generateJWT(user: UserEntity): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      this.configService.get('app-env.jwt_secret'),
    );
  }

  /**
   * @async
   * @param user - user entity
   * @returns logged in user object
   */
  async loginUser(user: LoginUserDto): Promise<LoggedInUserDto> {
    const userByDB = await this.userRepository.findOne(
      { email: user.email },
      {
        select: ['username', 'email', 'id', 'password', 'username'],
      },
    );

    if (!userByDB) {
      throw new HttpException('Unknown User', HttpStatus.BAD_REQUEST);
    }

    const passwordsMatched = await bcrypt.compare(
      user.password,
      userByDB.password,
    );

    delete userByDB.password;

    if (passwordsMatched) {
      return {
        user: userByDB,
        token: this.generateJWT(userByDB),
      };
    } else {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
  }
}
