import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'auth/dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceDoesnotExistException } from 'shared/exceptions';
import { ValidationError } from './enums/error.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.userRepository.save(createUserDto);
    delete user.password;
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find error');
    }
    return user;
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
