import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([Users]),
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.register({
			secret: "topSecret51",
			signOptions: {
				expiresIn: 3600
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UserRepository, JwtStrategy],
	exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
