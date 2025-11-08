import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfileService {
    constructor(private readonly usersService: UsersService) { }

    async getProfile(userId: number) {
        return this.usersService.findOne(userId);
    }
}