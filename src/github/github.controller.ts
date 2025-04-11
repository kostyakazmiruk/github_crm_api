// src/github/github.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repository/:path')
  getRepository(@Param('path') path: string) {
    return this.githubService.getRepositoryData(path);
  }
}
