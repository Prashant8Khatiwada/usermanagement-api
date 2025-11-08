import { UseGuards, Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@Request() req) {
        const user = await this.profileService.getProfile(req.user.userId);
        return { user, message: 'Profile data retrieved successfully' };
    }
}