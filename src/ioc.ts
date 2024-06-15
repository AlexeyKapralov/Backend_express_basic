import 'reflect-metadata'
import {Container} from "inversify";
import {UsersRepository} from "./features/users/repository/users.repository";
import {CommentsRepository} from "./features/comments/repository/comments.repository";
import {CommentsService} from "./features/comments/service/comments.service";
import {CommentsController} from "./features/comments/comments.controller";
import {JwtService} from "./common/adapters/jwtService";
import {UsersQueryRepository} from "./features/users/repository/usersQuery.repository";
import {CommentsQueryRepository} from "./features/comments/repository/commentsQuery.repository";
import {UsersService} from "./features/users/service/users.service";
import {BcryptService} from "./common/adapters/bcrypt.service";
import {AuthService} from "./features/auth/service/auth.service";
import {DevicesRepository} from "./features/securityDevices/repository/devices.repository";
import {EmailService} from "./common/adapters/email.service";
import {DevicesService} from "./features/securityDevices/service/devicesService";
import {DevicesQueryRepository} from "./features/securityDevices/repository/devices.queryRepository";
import {PostsService} from "./features/posts/service/posts.service";
import {BlogsRepository} from "./features/blogs/repository/blogs.repository";
import {PostsRepository} from "./features/posts/repository/posts.repository";
import {PostsQueryRepository} from "./features/posts/repository/postsQuery.repository";
import {BlogsService} from "./features/blogs/sevice/blogs.service";

export const container = new Container()

container.bind(CommentsService).to(CommentsService)
container.bind(UsersService).to(UsersService)
container.bind(AuthService).to(AuthService)
container.bind(DevicesService).to(DevicesService)
container.bind(BlogsService).to(BlogsService)

container.bind(JwtService).to(JwtService)
container.bind(BcryptService).to(BcryptService)
container.bind(EmailService).to(EmailService)
container.bind(PostsService).to(PostsService)


container.bind(CommentsController).to(CommentsController)

container.bind(CommentsRepository).to(CommentsRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(DevicesRepository).to(DevicesRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(PostsRepository).to(PostsRepository)


container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(DevicesQueryRepository).to(DevicesQueryRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)

