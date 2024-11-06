import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceDoesnotExistException } from 'src/shared/exceptions';
import { ValidationError } from './enums/error.enum';
import { hashPassword } from 'src/shared/helpers/password.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const alreadyExists = await this.findOneByEmail(createUserDto.email);
      if (alreadyExists) {
        throw new ConflictException(ValidationError.USER_ALREADY_EXISTS);
      }
      createUserDto.password = await hashPassword(createUserDto.password);
      const user = await this.userRepository.save(createUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message || 'Error Occurred');
    }
  }

  findAll():Promise<User[]> {
    return this.userRepository.find({});
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async getByUUID(uuid: string, options?: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user)
      throw new ResourceDoesnotExistException(ValidationError.USER_NOT_FOUND);
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
