import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
import * as bcrypt from 'bcrypt';


export interface IUser {
  id: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  // Return a promise that resolves to an array of users
  findAll(): Promise<User[]> {
    return this.userRepo.find();
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
