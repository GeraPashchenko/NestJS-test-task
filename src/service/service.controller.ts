import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { SubscribeUserDto } from './dto/subscribe-user.dto';
import { BannedUsersEntity } from './entity/banned-users.entity';
import { ServiceEntity } from './entity/service.entity';
import { ServiceService } from './service.service';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'All existed services',
    type: [ServiceEntity],
  })
  async getAllServices(@User('id') userId: number): Promise<ServiceEntity[]> {
    return await this.serviceService.getAllServices(userId);
  }

  @Post()
  @ApiOkResponse({
    description: 'Created service',
    type: ServiceEntity,
  })
  @UsePipes(new ValidationPipe())
  async createService(
    @Body() createServiceBody: CreateServiceDto,
  ): Promise<ServiceEntity> {
    return await this.serviceService.createService(createServiceBody);
  }

  @Post('/subscribe')
  @ApiOkResponse({
    description: 'Subscribed user',
    type: UserEntity,
  })
  @UsePipes(new ValidationPipe())
  async subscribeUserToService(
    @Body() subscribeUserDto: SubscribeUserDto,
  ): Promise<UserEntity> {
    return await this.serviceService.subscribeUser(subscribeUserDto);
  }

  @Get(':term')
  @ApiOkResponse({
    description: 'Full test search by service title',
    type: UserEntity,
  })
  async findServicesByFullTextSearchWithTitle(
    @Param('term') term: string,
  ): Promise<ServiceEntity[]> {
    return await this.serviceService.findServicesBySubstring(term);
  }

  @Post('/ban-user')
  @ApiOkResponse({
    description: 'Ban user on the specific service',
    type: BannedUsersEntity,
  })
  async banUser(@Body() banUserDto: BanUserDto): Promise<BannedUsersEntity> {
    return await this.serviceService.banUser(banUserDto);
  }
}
