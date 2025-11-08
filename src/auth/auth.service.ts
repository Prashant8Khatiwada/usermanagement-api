import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findByUserName(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...rest } = user;
            return rest;
        }
        return null;
    }

    async login(user: { id: number; username: string }) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async register(createUserDto: any) {
        return this.userService.create(createUserDto);
    }
}
