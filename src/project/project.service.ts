import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const repoData = await this.githubService.getRepositoryData(
      createProjectDto.path,
    );

    return this.prisma.project.create({
      data: {
        ...repoData,
        userId,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        addedAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(id: number, userId: number) {
    const project = await this.findOne(id, userId);
    const repoPath = `${project.owner}/${project.name}`;
    const repoData = await this.githubService.getRepositoryData(repoPath);

    return this.prisma.project.update({
      where: { id },
      data: repoData,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
