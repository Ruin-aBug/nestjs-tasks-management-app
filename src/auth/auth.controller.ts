import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthVerifyDto } from './dto/auth-verify.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService
	) { }

	@Post("/signup")
	signUp(@Body() authVerifyDto: AuthVerifyDto): Promise<void> {
		return this.authService.signUp(authVerifyDto);
	}

	@Post("/signin")
	signIn(@Body() authVerifyDto: AuthVerifyDto): Promise<{ accessToken: string }> {
		return this.authService.signIn(authVerifyDto);
	}

}
