import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserEntity } from './entity/user.entity';
import { LoggedInUserDto } from './dto/logged-in-user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({
    description: 'Created user',
    type: UserEntity,
  })
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }

  @ApiOkResponse({
    description: 'User info',
    type: UserEntity,
  })
  @Get(':id')
  async getUserInfo(@Param('id') userId: number): Promise<UserEntity> {
    return await this.userService.findById(userId);
  }

  @ApiOkResponse({
    description: "User's subscribtions",
    type: [ServiceEntity],
  })
  @Get('/subscription/:id')
  async getUsersSubscriptions(
    @Param('id') userId: number,
  ): Promise<ServiceEntity[]> {
    return await this.userService.getUsersSubscriptions(userId);
  }

  @ApiOkResponse({
    description: 'User login',
    type: LoggedInUserDto,
  })
  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoggedInUserDto> {
    return await this.userService.loginUser(loginUserDto);
  }
}
