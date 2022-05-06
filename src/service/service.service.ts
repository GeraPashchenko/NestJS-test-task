import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Like, Repository } from 'typeorm';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { SubscribeUserDto } from './dto/subscribe-user.dto';
import { ServiceEntity } from './entity/service.entity';
import { BannedUsersEntity } from './entity/banned-users.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(BannedUsersEntity)
    private readonly BannedUsersRepository: Repository<BannedUsersEntity>,
  ) { }

  /**
   * @async
   * Create a new service
   * @param createServiceDto - service dto
   * @returns created service
   */
  async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceEntity> {
    const serviceByTitle = await this.serviceRepository.findOne({
      title: createServiceDto.title,
    });

    if (serviceByTitle) {
      throw new HttpException(
        'Service with this title already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newService = new ServiceEntity();
    Object.assign(newService, createServiceDto);

    return await this.serviceRepository.save(newService);
  }

  async banUser(banDto: BanUserDto): Promise<BannedUsersEntity> {
    const user = await this.userRepository.findOne(banDto.userId);
    const service = await this.serviceRepository.findOne(banDto.serviceId);

    if (!user || !service) {
      throw new HttpException(
        'User or service does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const banned = await this.BannedUsersRepository.findOne({
      user_id: banDto.userId,
      service_id: banDto.serviceId,
    });

    if (banned) {
      throw new HttpException(
        'User was already banned',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bannedUser = new BannedUsersEntity();
    bannedUser.service_id = banDto.serviceId;
    bannedUser.user_id = banDto.userId;

    await this.BannedUsersRepository.save(bannedUser);

    return await this.BannedUsersRepository.save(bannedUser);
  }

  /**
   * @async
   * Get All services
   * @param userId - user's id
   * @returns services
   */
  async getAllServices(userId: number): Promise<ServiceEntity[]> {
    const bannedServicesQuery = this.BannedUsersRepository.createQueryBuilder(
      'banned',
    )
      .where(`banned.user_id = ${userId}`)
      .select('banned.service_id')
      .getSql();

    return this.serviceRepository
      .createQueryBuilder('service')
      .where(`service.id NOT IN (${bannedServicesQuery})`)
      .select('service')
      .execute();
  }

  /**
   * @async
   * Subscribe User to a Service
   * @param subscribeUserDto - user and service ids
   * @returns subscribed user and a service
   */
  async subscribeUser(subscribeUserDto: SubscribeUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(subscribeUserDto.userId, {
      relations: ['services'],
    });
    const service = await this.serviceRepository.findOne(
      subscribeUserDto.serviceId,
    );

    if (!user || !service) {
      throw new HttpException(
        'User or service does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const subscribed = user.services.find(
      (service) => service.id === subscribeUserDto.serviceId,
    );

    if (subscribed) {
      throw new HttpException(
        'User was already subscribed',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.services.push(service);

    await this.userRepository.save(user);

    return user;
  }

  /**
   * @async
   * Full test search of services
   * @param term - substring to search
   * @returns services wich has term in title
   */
  async findServicesBySubstring(term: string): Promise<ServiceEntity[]> {
    try {
      await this.serviceRepository.findOneOrFail({
        title: Like(`%${term}%`),
      });
    } catch (error) {
      throw new HttpException('Services not found', HttpStatus.NOT_FOUND);
    }

    const servicesSorted = await this.serviceRepository
      .createQueryBuilder('service')
      .where('service.title like :term', { term: `%${term}%` })
      .leftJoinAndSelect('service.subscribers', 'subscriber')
      .select('COUNT(subscriber.id)', 'subscribers_count')
      .addSelect('service')
      .groupBy('service.id')
      .orderBy('subscribers_count', 'DESC')
      .execute();

    return servicesSorted;
  }
}
