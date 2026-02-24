import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('gamification')
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Get('leaderboard')
    async getLeaderboard(@Query('limit') limit: string) {
        const limitNum = parseInt(limit) || 10;
        return this.gamificationService.getLeaderboard(limitNum);
    }
}
