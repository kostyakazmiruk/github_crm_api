import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import { GithubRepositoryData } from './dto/github-repository.dto';

const execPromise = promisify(exec);

@Injectable()
export class GithubService {
  constructor(private configService: ConfigService) {}

  async getRepositoryData(path: string): Promise<GithubRepositoryData> {
    if (!path || !path.includes('/')) {
      throw new NotFoundException(
        'Invalid repository path. Format should be owner/repo',
      );
    }

    const [owner, repo] = path.split('/');
    const token = this.configService.get<string>('GITHUB_TOKEN');

    if (!token) {
      throw new Error('GitHub token is not configured');
    }

    try {
      const curlCommand = `curl -s -L \\
        -H "Accept: application/vnd.github+json" \\
        -H "Authorization: Bearer ${token}" \\
        -H "X-GitHub-Api-Version: 2022-11-28" \\
        https://api.github.com/repos/${owner}/${repo}`;

      const { stdout, stderr } = await execPromise(curlCommand);

      if (stderr) {
        throw new Error(`Curl error: ${stderr}`);
      }

      const data = JSON.parse(stdout);

      if (data.message === 'Not Found') {
        throw new NotFoundException(`Repository ${path} not found`);
      }

      return {
        owner: data.owner.login,
        name: data.name,
        url: data.html_url,
        stars: data.stargazers_count,
        forks: data.forks_count,
        issues: data.open_issues_count,
        createdAtTimestamp: Math.floor(
          new Date(data.created_at).getTime() / 1000,
        ),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.message?.includes('Not Found')) {
        throw new NotFoundException(`Repository ${path} not found`);
      }

      throw new Error(`Failed to fetch repository data: ${error.message}`);
    }
  }
}
