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

  findone(id: number): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(user: IUser): IUser {
    this.users.push(user);
    return user
  }

  update(id: number, updatedData: Partial<IUser>): IUser | undefined {
    const user = this.findone(id);
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
