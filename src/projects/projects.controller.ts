import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { Request } from "express";

import { AuthGuard } from "src/auth/auth.guard";

import { ProjectsService } from "./projects.service";

import { CreateProjectDto } from "./dtos/create-project.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { MemberDto } from "./dtos/memeber.dto";

import { IFollowUser } from "src/interfaces/users";
import { projectsType } from "src/interfaces/projects";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProjectByOwnerId(@Req() req: Request, @Query("type") type: projectsType = "all") {
    const user = req["user"] as IFollowUser;
    return await this.projectsService.getProjects(user.id, type);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async getProjectById(@Param("id") id: number) {
    return await this.projectsService.getProjectById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(createProjectDto);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  async updateProjectName(@Body() updateProjectDto: UpdateProjectDto) {
    await this.projectsService.updateProjectName(updateProjectDto);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deleteProject(@Req() req: Request, @Param("id") id: number) {
    const user = req["user"] as IFollowUser;

    await this.projectsService.deleteProject(id, user.id);
  }

  @UseGuards(AuthGuard)
  @Post("member")
  async addNewMember(@Body() memberDto: MemberDto) {
    await this.projectsService.addNewMember(memberDto);
  }

  @UseGuards(AuthGuard)
  @Delete("member")
  async removeMember(@Body() memberDto: MemberDto) {
    await this.projectsService.removeMember(memberDto);
  }
}
