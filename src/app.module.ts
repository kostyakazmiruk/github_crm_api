import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GithubService } from './github/github.service';
import { GithubModule } from './github/github.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, GithubModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, GithubService],
})
export class AppModule {}
