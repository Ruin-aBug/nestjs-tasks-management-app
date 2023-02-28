import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

	constructor(
		// @InjectRepository(TasksRepository)
		private readonly taskRepository: TasksRepository
	) { }

	/**
	 * getAllTasks
	 */
	getAllTasks(): Promise<Task[]> {
		return this.taskRepository.find();
	}

	getTaskWithSearch(filterDto: GetTaskFilterDto, user: Users): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto, user);
	}

	async getTaskById(id: string, user: Users): Promise<Task> {
		const found = await this.taskRepository.findOne({ where: { id, user } });
		if (!found) {
			throw new NotFoundException(`Task with Id ${id} not found`);
		}
		return found;
	}

	createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto, user);
	}

	async deleteTask(id: string, user: Users): Promise<void> {
		const res = await this.taskRepository.deleteTask(id, user);
		if (res.affected === 0) {
			throw new NotFoundException(`Task with Id ${id} not found`);
		}
	}

	async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: Users): Promise<Task> {
		const task = await this.getTaskById(id, user);
		task.status = updateTaskStatusDto.status;
		await this.taskRepository.save(task);
		return task;
	}
}
