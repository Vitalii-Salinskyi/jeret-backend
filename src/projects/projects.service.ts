import { Injectable } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { CreateProjectDto } from "./dtos/create-project.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly dbService: DatabaseService) {}

  async getProjectByOwnerId(owner_id: number) {
    const query = `SELECT * FROM projects WHERE owner_id = $1`;

    try {
      const result = await this.dbService.query(query, [owner_id]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getProjectMembership(user_id: number) {
    const query = `SELECT * FROM projects_members WHERE member_id = $1`;

    try {
      const result = await this.dbService.query(query, [user_id]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getProjectById(id: number) {
    const query = `SELECT * FROM projects WHERE id = $1`;

    try {
      const result = await this.dbService.query(query, [id]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const query = `INSERT INTO projects (name, owner_id) VALUES($1, $2)`;

    try {
      await this.dbService.query(query, [createProjectDto.name, createProjectDto.owner_id]);
    } catch (error) {
      throw error;
    }
  }

  async addNewMember(user_id: number, project_id: number) {
    const query = `INSERT INTO projects_members (member_id, project_id) VALUES ($1, $2)`;

    try {
      await this.dbService.query(query, [user_id, project_id]);
    } catch (error) {
      throw error;
    }
  }

  async removeMember(project_id: number) {
    const query = `DELETE FROM projects_members WHERE id = $1`;

    try {
      await this.dbService.query(query, [project_id]);
    } catch (error) {
      throw error;
    }
  }

  async updateProjectName(updateProjectDto: UpdateProjectDto) {
    const query = `UPDATE projects SET name = $1 WHERE id = $2`;

    try {
      await this.dbService.query(query, [updateProjectDto.name, updateProjectDto.project_id]);
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(id: number) {
    const query = `DELETE FROM projects WHERE id = $1`;

    try {
      await this.dbService.query(query, [id]);
    } catch (error) {
      throw error;
    }
  }
}
