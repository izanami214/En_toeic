import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CompanionService } from './companion.service';
import type { SendMessageDto, ChatResponse } from './companion.service';

@Controller('companion')
export class CompanionController {
    constructor(private readonly companionService: CompanionService) { }

    @Post('chat')
    async sendMessage(
        @Body() dto: SendMessageDto,
    ): Promise<ChatResponse> {
        return this.companionService.sendMessage(dto);
    }

    @Get('history/:sessionId')
    async getHistory(@Param('sessionId') sessionId: string) {
        return this.companionService.getHistory(sessionId);
    }

    @Get('sessions/:userId')
    async getSessions(@Param('userId') userId: string) {
        return this.companionService.getSessions(userId);
    }

    @Delete('sessions/:sessionId')
    async deleteSession(@Param('sessionId') sessionId: string) {
        return this.companionService.deleteSession(sessionId);
    }
}
