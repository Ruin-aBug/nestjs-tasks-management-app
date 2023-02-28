import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { JwtPayload } from "./jwt-payload.interface";
import { Users } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(UserRepository)
		private readonly userRepository: UserRepository
	) {
		super({
			secretOrKey: "topSecret51",
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		});
	}

	async validate(payload: JwtPayload): Promise<Users> {
		const { username } = payload;
		const user = this.userRepository.findOne({ where: { username } });

		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}