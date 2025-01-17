import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { DatabaseException } from "src/exceptions/database.exception";

import { CreateProjectDto } from "./dtos/create-project.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { MemberDto } from "./dtos/memeber.dto";

import { IProject, projectsType } from "src/interfaces/projects";

@Injectable()
export class ProjectsService {
  constructor(private readonly dbService: DatabaseService) {}

  async getProjects(owner_id: number, type: projectsType = "all"): Promise<IProject[]> {
    const ownProjectsQuery = `
      SELECT *,
        jsonb_build_object(
          'pending', (status).pending,
          'progress', (status).progress,
          'completed', (status).completed,
          'review', (status).review
        ) as status
      FROM projects 
      WHERE owner_id = $1
    `;

    const allProjectsQuery = `
      SELECT DISTINCT p.*,
        jsonb_build_object(
          'pending', (status).pending,
          'progress', (status).progress,
          'completed', (status).completed,
          'review', (status).review
        ) as status
      FROM projects_members AS pm
      INNER JOIN projects AS p ON p.id = pm.project_id
      WHERE member_id = $1
    `;

    const query = type === "all" ? allProjectsQuery : ownProjectsQuery;

    try {
      const result = await this.dbService.query<IProject>(query, [owner_id]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getProjectById(id: number): Promise<IProject> {
    const query = `SELECT * FROM projects WHERE id = $1`;

    try {
      const result = await this.dbService.query<IProject>(query, [id]);

      if (result.rows.length === 0) {
        throw new NotFoundException(`Project with ID ${id} not found.`);
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<IProject> {
    const query = `
      INSERT INTO projects (name, owner_id)
      VALUES($1, $2)
      RETURNING *,
        jsonb_build_object(
          'pending', (status).pending,
          'progress', (status).progress,
          'completed', (status).completed,
          'review', (status).review
        ) as status
    `;

    try {
      const result = await this.dbService.query<IProject>(query, [
        createProjectDto.name,
        createProjectDto.owner_id,
      ]);

      result.rows[0].members_count++; // send to the client project with the initial user

      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseException) {
        const dbError = error.getResponse();

        if (dbError?.constraints === "unique_project_name_per_owner") {
          error.setMessage(
            `You already have a project named "${createProjectDto.name}" in your own projects. Project names must be unique within your own projects.`,
          );
        }

        console.log(dbError);
      }

      throw error;
    }
  }

  async addNewMember({ project_id, member_id }: MemberDto): Promise<void> {
    const query = `INSERT INTO projects_members (member_id, project_id) VALUES ($1, $2)`;

    try {
      await this.dbService.query(query, [member_id, project_id]);
    } catch (error) {
      throw error;
    }
  }

  async removeMember({ project_id, member_id }: MemberDto): Promise<void> {
    const query = `DELETE FROM projects_members WHERE project_id = $1 AND member_id = $2`;

    try {
      await this.dbService.query(query, [project_id, member_id]);
    } catch (error) {
      throw error;
    }
  }

  async updateProjectName(updateProjectDto: UpdateProjectDto): Promise<void> {
    const query = `UPDATE projects SET name = $1 WHERE id = $2`;

    try {
      await this.dbService.query(query, [updateProjectDto.name, updateProjectDto.project_id]);
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(id: number, user_id: number): Promise<void> {
    const query = `DELETE FROM projects WHERE id = $1`;

    try {
      const project = await this.getProjectById(id);

      if (project.owner_id !== user_id) {
        throw new UnauthorizedException(
          `You are not authorized to delete the project "${project.name}" (ID: ${id}). Only the project owner can perform this action.`,
        );
      }

      await this.dbService.query(query, [id]);
    } catch (error) {
      throw error;
    }
  }

  async bulkDeleteProjects(ids: number[]) {
    const query = `DELETE FROM projects WHERE id = ANY($1::int[])`;

    try {
      await this.dbService.query(query, [ids]);
    } catch (error) {
      throw error;
    }
  }
}
