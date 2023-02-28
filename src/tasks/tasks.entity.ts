import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./tasks-status.enum";
import { Users } from "src/auth/user.entity";

@Entity()
export class Task {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	status: TaskStatus;

	@ManyToOne((_type) => Users, (user) => user.tasks, { eager: false })
	user: Users;

}