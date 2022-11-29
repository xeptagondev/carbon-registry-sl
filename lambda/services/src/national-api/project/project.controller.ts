import { Body, Controller, Get, Param, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Project } from '../../shared/entities/project.entity';
import { Action } from '../../shared/casl/action.enum';
import { AppAbility } from '../../shared/casl/casl-ability.factory';
import { CheckPolicies } from '../../shared/casl/policy.decorator';
import { PoliciesGuard } from '../../shared/casl/policy.guard';
import { ProjectDto } from '../../shared/dto/project.dto';
import { ProjectService } from './project.service';
import { ApiKeyJwtAuthGuard } from '../auth/guards/api-jwt-key.guard';
import { QueryDto } from '../../shared/dto/query.dto';
import { ConstantUpdateDto } from '../../shared/dto/constants.update.dto';
import { SubSector } from '../../shared/enum/subsector.enum';

@ApiTags('Project')
@ApiBearerAuth('api_key')
@ApiBearerAuth()
@Controller('project')
export class ProjectController {

    constructor(private projectService: ProjectService) {

    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Project))
    @Post('add')
    async addProject(@Body()project: ProjectDto) {
      return this.projectService.create(project)
    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Project))
    @Get('query')
    async getAll(@Query()query: QueryDto) {
      return this.projectService.query(query)
    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Project))
    @Get('getHistory')
    async getHistory(@Query('projectId') projectId: string) {
        return this.projectService.getProjectEvents(projectId)
    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuard)
    @Post('updateConfigs')
    async updateConfigs(@Body() config: ConstantUpdateDto) {
        return this.projectService.updateCustomConstants(config.type, config);
    }
}
