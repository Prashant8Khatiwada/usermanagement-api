import { Injectable } from '@nestjs/common';

export interface IUser {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  private users: IUser[] = [
    { id: 1, name: 'Prashant' },
    { id: 2, name: 'Ajita' },
  ];

  findAll(): IUser[] {
    return this.users;
  }

  findOne(id: number): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(userData: Omit<IUser, 'id'>): IUser {
    const id = Math.max(...this.users.map(u => u.id), 0) + 1;
    const user = { id, ...userData };
    this.users.push(user);
    return user;
  }

  update(id: number, updatedData: Partial<IUser>): IUser | undefined {
    const user = this.findOne(id);
    if (!user) return undefined
    Object.assign(user, updatedData);
    return user;
  }

  remove(id: number): boolean {
    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) return false
    this.users.splice(index, 1)
    return true
  }
}
