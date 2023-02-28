import { DataSource, Repository } from "typeorm";
import { Users } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { AuthVerifyDto } from "./dto/auth-verify.dto";
import { genSalt, hash } from "bcrypt";

@Injectable()
export class UserRepository extends Repository<Users>{
	constructor(private readonly dataSource: DataSource) {
		super(Users, dataSource.createEntityManager())
	}

	async createUser(authVerifyDto: AuthVerifyDto): Promise<void> {
		const { username, password } = authVerifyDto;
		const salt = await genSalt();
		const hash_passwd = await hash(password, salt);

		const user = this.create({ username, password: hash_passwd });
		await this.save(user);
	}

}