import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthVerifyDto } from './dto/auth-verify.dto';
import { compare } from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService
	) { }

	async signUp(authVerifyDto: AuthVerifyDto): Promise<void> {
		try {
			await this.userRepository.createUser(authVerifyDto);
		} catch (error) {
			if (error.errno === 1062) {
				throw new ConflictException("username already exists");
			} else {
				throw new InternalServerErrorException();
			}
		}
	}

	async signIn(authVerifyDto: AuthVerifyDto): Promise<{ accessToken: string }> {
		const { username, password } = authVerifyDto;
		const user = await this.userRepository.findOne({ where: { username } });

		if (user && await compare(password, user.password)) {
			const payload: JwtPayload = { username };
			const accessToken: string = this.jwtService.sign(payload);
			return { accessToken };
		} else {
			throw new UnauthorizedException("Please check your login info.");
		}
	}
}
