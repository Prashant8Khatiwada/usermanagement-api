import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { DeleteResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paginate } from '../common/utils/paginate';


export interface IUser {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  // Return a promise that resolves to paginated users with optional role filter
  async findAll(userId: string, page: number = 1, limit: number = 10, role?: string) {
    this.logger.log(`UsersService.findAll called with userId: ${userId}, page: ${page}, limit: ${limit}, role: ${role}`);

    const query = this.userRepo.createQueryBuilder('user');

    if (role) {
      query.where('user.role = :role', { role });
    }

    const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();

    return paginate(data, total, page, limit);
  }

  // Return a promise that resolves to a single user or null
  findOne(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id })
  }

  async findByUserName(username: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ username: username });
    return user || null;
  }


  // Create a user and return a promise resolving to the created user
  async create(userData: Omit<IUser, 'id'>): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepo.create({ ...userData, password: hashedPassword });
    return this.userRepo.save(user);
  }

  // Update a user, return the updated user or undefined if not found
  async update(id: string, updatedData: Partial<User>): Promise<User | undefined> {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) return undefined;
    Object.assign(user, updatedData);
    return this.userRepo.save(user)
  }

  // Remove a user, return true if deleted, false otherwise
  async remove(id: string): Promise<boolean> {
    const result: DeleteResult = await this.userRepo.delete(id)
    return (result.affected ?? 0) > 0;
  }
}
