import {BlogsRepository} from "../blogs/repository/blogs.repository";
import {PostsRepository} from "./repository/posts.repository";
import {PostsService} from "./service/posts.service";
import {UsersRepository} from "../users/repository/users.repository";
import {CommentsRepository} from "../comments/repository/comments.repository";

const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository(blogsRepository)
const usersRepository = new UsersRepository()
const commentsRepository = new CommentsRepository()
export const postsService = new PostsService(blogsRepository, postsRepository, usersRepository, commentsRepository)