import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchema } from './config.schema';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.STAGE}`],
			validationSchema: configSchema
		}),
		TasksModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				return {
					type: "mysql",
					autoLoadEntities: true,
					synchronize: true,
					host: configService.get("DB_HOST"),
					username: configService.get("DB_USERNAME"),
					password: configService.get("DB_PASSWORD"),
					port: configService.get("DB_PORT"),
					database: configService.get("DB_DATABASE")
				}
			}
		}),
		AuthModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {
}
