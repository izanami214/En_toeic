import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestsModule } from './tests/tests.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { TestSessionsModule } from './test-sessions/test-sessions.module';
import { CompanionModule } from './companion/companion.module';

@Module({
  imports: [TestsModule, FlashcardsModule, TestSessionsModule, CompanionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
