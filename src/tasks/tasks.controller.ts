import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { Users } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	constructor(private tasksService: TasksService) { }

	@Get("/:id")
	getTaskById(
		@Param("id") id: string,
		@GetUser() user: Users
	): Promise<Task> {
		return this.tasksService.getTaskById(id, user)
	}

	@Get()
	getTaskWithSearch(
		@Query() filterDto: GetTaskFilterDto,
		@GetUser() user: Users
	): Promise<Task[]> {
		return this.tasksService.getTaskWithSearch(filterDto, user);
	}

	@Post()
	createTask(
		@Body() createTaskDto: CreateTaskDto,
		@GetUser() user: Users
	): Promise<Task> {
		return this.tasksService.createTask(createTaskDto, user);
	}

	@Delete("/:id")
	deleteTask(
		@Param("id") id: string,
		@GetUser() user: Users
	): Promise<void> {
		return this.tasksService.deleteTask(id, user);
	}

	@Patch("/:id/status")
	updateTaskStatus(
		@Param("id") id: string,
		@Body() updateTaskStatusDto: UpdateTaskStatusDto,
		@GetUser() user: Users
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
	}
}
