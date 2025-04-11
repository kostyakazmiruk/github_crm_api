import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { ConfigModule } from '@nestjs/config';
import { GithubController } from './github.controller';

@Module({
  imports: [ConfigModule],
  providers: [GithubService],
  exports: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
