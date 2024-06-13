import {IPostInputModel} from '../models/postInput.model'
import {ICommentInputModel} from '../../comments/models/commentInput.model'
import {ResultType} from '../../../common/types/result.type'
import {ICommentViewModel} from '../../comments/models/commentView.model'
import {ResultStatus} from '../../../common/types/resultStatus.type'
import {IPostViewModel} from '../models/postView.model'
import {getCommentView} from "../../comments/mappers/commentsMappers";
import {BlogsRepository} from "../../blogs/repository/blogs.repository";
import {PostsRepository} from "../repository/posts.repository";
import {UsersRepository} from "../../users/repository/users.repository";
import {CommentsRepository} from "../../comments/repository/comments.repository";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
    ) {
    }

    async createPost(body: IPostInputModel): Promise<ResultType<IPostViewModel | null>> {
        const foundBlog = await this.blogsRepository.getBlogByID(body.blogId)

        if (!foundBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        const result = await this.postsRepository.createPost(body, foundBlog.name)
        return result
            ? {
                status: ResultStatus.Success,
                data: result
            }
            : {
                status: ResultStatus.BadRequest,
                data: null
            }

    }

    async updatePost(id: string, body: IPostInputModel): Promise<ResultType> {
        return await this.postsRepository.updatePost(id, body)
            ? {
                status: ResultStatus.Success,
                data: null
            }
            : {
                status: ResultStatus.BadRequest,
                data: null
            }
    }

    async deletePost(id: string): Promise<ResultType> {
        return await this.postsRepository.deletePost(id)
            ? {
                status: ResultStatus.Success,
                data: null
            }
            : {
                status: ResultStatus.BadRequest,
                data: null
            }
    }

    async createComment(userId: string, postId: string, body: ICommentInputModel): Promise<ResultType<ICommentViewModel | null>> {
        const post = await this.postsRepository.getPostById(postId)
        const user = await this.usersRepository.findUserById(userId)

        if (post && user) {
            const res = await this.commentsRepository.createComment(user, post, body)
            return res
                ? {
                    status: ResultStatus.Success,
                    data: getCommentView(res)
                }
                : {
                    status: ResultStatus.BadRequest,
                    data: null
                }
        } else {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
    }
}