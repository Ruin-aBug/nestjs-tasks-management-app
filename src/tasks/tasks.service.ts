import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';

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

	getTaskWithSearch(filterDto: GetTaskFilterDto): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto);
	}

	async getTaskById(id: string): Promise<Task> {
		const found = await this.taskRepository.findOneBy({ id });
		if (!found) {
			throw new NotFoundException(`Task with Id ${id} not found`);
		}
		return found;
	}

	createTask(createTaskDto: CreateTaskDto): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto);
	}

	async deleteTask(id: string): Promise<void> {
		const res = await this.taskRepository.deleteTask(id);
		if (res.affected === 0) {
			throw new NotFoundException(`Task with Id ${id} not found`);
		}
	}

	async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
		const task = await this.getTaskById(id);
		task.status = updateTaskStatusDto.status;
		await this.taskRepository.save(task);
		return task;
	}
}
