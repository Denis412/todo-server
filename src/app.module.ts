import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { NotificationModule } from './notification/notification.module';
import { GroupModule } from './group/group.module';
import { FileModule } from './file/file.module';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './auth/guards/auth.guard';
import { PermissionGuard } from './permission/guards/permission.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'src/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    ChatModule,
    MessageModule,
    PermissionModule,
    AuthModule,
    TaskModule,
    ProjectModule,
    NotificationModule,
    GroupModule,
    FileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
