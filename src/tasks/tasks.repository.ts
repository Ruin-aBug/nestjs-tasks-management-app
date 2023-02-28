import { DataSource, DeleteResult, Repository } from "typeorm";
import { Task } from "./tasks.entity";
import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./tasks-status.enum";
import { GetTaskFilterDto } from "./dto/get-task.dto";
import { Users } from "src/auth/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task>{
	constructor(
		private dataSource: DataSource
	) {
		super(Task, dataSource.createEntityManager())
	}

	async getTasks(filterDto: GetTaskFilterDto, user: Users): Promise<Task[]> {
		const { status, search } = filterDto;
		const query = this.createQueryBuilder("task");

		query.where({ user })

		if (status) {
			query.andWhere("task.status = :status", { status });
		}

		if (search) {
			query.andWhere(
				"(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))",
				{ search: `%${search}%` }
			);
		}

		const tasks = await query.getMany();

		return tasks
	}

	async createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
		const task = this.create({
			title: createTaskDto.title,
			description: createTaskDto.description,
			status: TaskStatus.OPEN,
			user: user
		});

		await this.save(task);
		return task;
	}

	async deleteTask(id: string, user: Users): Promise<DeleteResult> {
		return await this.delete({ id, user });
	}
}