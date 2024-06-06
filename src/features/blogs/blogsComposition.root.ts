import {BlogsService} from "./sevice/blogs.service";
import {BlogsRepository} from "./repository/blogs.repository";
import {PostsRepository} from "../posts/repository/posts.repository";

const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository(blogsRepository)
export const blogsService = new BlogsService(blogsRepository, postsRepository)