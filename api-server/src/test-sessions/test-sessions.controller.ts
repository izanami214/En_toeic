import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TestSessionsService } from './test-sessions.service';

@Controller('test-sessions')
export class TestSessionsController {
    constructor(private readonly testSessionsService: TestSessionsService) { }

    @Post('start')
    startSession(@Body() body: { userId: string; testId: string }) {
        return this.testSessionsService.startSession(body.userId, body.testId);
    }

    @Post(':id/submit')
    submitSession(
        @Param('id') sessionId: string,
        @Body()
        body: {
            answers: Array<{ questionId: string; selectedOption: string }>;
            durationTaken: number;
        },
    ) {
        return this.testSessionsService.submitSession(
            sessionId,
            body.answers,
            body.durationTaken,
        );
    }

    @Get(':id/result')
    getResult(@Param('id') sessionId: string) {
        return this.testSessionsService.getResult(sessionId);
    }

    @Get('history')
    getUserHistory(@Query('userId') userId: string) {
        return this.testSessionsService.getUserHistory(userId);
    }
}
