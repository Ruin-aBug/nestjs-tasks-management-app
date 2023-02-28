import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthVerifyDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(4, { message: "user name is too short" })
	@MaxLength(20, { message: "user name is too long" })
	username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8, { message: "password is too short" })
	@MaxLength(32, { message: "password is too long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: "password is too weak"
	})
	password: string;
}