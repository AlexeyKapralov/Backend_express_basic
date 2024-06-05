import {CommentsService} from "./service/comments.service";
import {UsersRepository} from "../users/repository/users.repository";
import {CommentsRepository} from "./repository/comments.repository";


const usersRepository = new UsersRepository()
const commentsRepository = new CommentsRepository()
export const commentsService = new CommentsService(usersRepository, commentsRepository)