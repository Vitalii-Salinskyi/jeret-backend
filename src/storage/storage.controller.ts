import { Controller, Get, Param, Res } from "@nestjs/common";

import { Response } from "express";

import { StorageService } from "./storage.service";

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(":key")
  async getFile(@Param("key") key: string, @Res() res: Response) {
    const file = await this.storageService.getFile(key);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=${key}`);
    res.send(file);
  }

  @Get(":key/url")
  async getFileUrl(@Param("key") key: string) {
    return await this.storageService.getFileUrl(key);
  }
}
