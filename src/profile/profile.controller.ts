import { UseGuards, Controller, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@Request() req) {
        const user = await this.profileService.getProfile(req.user.userId);
        return { user, message: 'Profile data retrieved successfully' };
    }
}