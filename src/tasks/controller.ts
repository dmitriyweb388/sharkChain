import { Request, Response } from "express";
import { TasksService } from "./service";

export class TasksController {
  static handleTask(req: Request, res: Response) {
    const task = req.body;

    TasksService.handleTask(task);

    res.send();
  }
}
