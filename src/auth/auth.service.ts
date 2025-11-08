import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
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

    async login(user: { id: string; username: string }) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        const { password, ...userWithoutPassword } = user;
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: userWithoutPassword
        };
    }

}
