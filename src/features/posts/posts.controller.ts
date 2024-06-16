import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {ICommentInputModel} from "../comments/models/commentInput.model";
import {ICommentViewModel} from "../comments/models/commentView.model";
import {ResultStatus} from "../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {IPostInputModel} from "./models/postInput.model";
import {IPostViewModel} from "./models/postView.model";
import {IQueryInputModel} from "../../common/types/query.model";
import {IPaginator} from "../../common/types/paginator";
import {getQueryParams} from "../../common/utils/mappers";
import {JwtService} from "../../common/adapters/jwtService";
import {PostsService} from "./service/posts.service";
import {UsersQueryRepository} from "../users/repository/usersQuery.repository";
import {CommentsQueryRepository} from "../comments/repository/commentsQuery.repository";
import {PostsQueryRepository} from "./repository/postsQuery.repository";
import {ILikeInputModel} from "../likes/models/like.type";

@injectable()
export class PostsController {

    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    ) {
    }

    async createCommentForPost (req: Request<{
        postId: string
    }, {}, ICommentInputModel>, res: Response<ICommentViewModel>) {
        const result = await this.postsService.createComment(req.userId!, req.params.postId, req.body)

        result.status === ResultStatus.Success
            ? res.status(StatusCodes.CREATED).json(result.data!)
            : res.status(StatusCodes.NOT_FOUND).json()
    }

    async createPost (req: Request<{},{},IPostInputModel>, res:Response<IPostViewModel>)  {
        const result = await this.postsService.createPost(req.body)
        result.status === ResultStatus.Success ? res.status(StatusCodes.CREATED).json(result.data!) : res.sendStatus(StatusCodes.BAD_REQUEST)
    }

    async deletePost (req: Request<{ id: string }>, res: Response<StatusCodes>) {
        const isDeleted = await this.postsService.deletePost(req.params.id)
        isDeleted ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
    }

    async getComments (req: Request<{id:string}, {},{},IQueryInputModel>, res: Response<IPaginator<ICommentViewModel>>) {

        const query = getQueryParams(req.query)

        const token = req.headers.authorization?.split(' ')[1] || null
        const userId = this.jwtService.getUserIdByToken(token || '')

        let result
        if (userId) {
            result = await this.usersQueryRepository.findUserById(userId.toString())
        }

        let comments
        if (result) {
            comments = await this.commentsQueryRepository.getComments(req.params.id, query, userId!)
        } else {
            comments = await this.commentsQueryRepository.getComments(req.params.id, query)
        }

        comments
            ? res.status(StatusCodes.OK).send(comments)
            : res.status(StatusCodes.NOT_FOUND).send()
    }

    async getPostById (req: Request, res: Response) {
        const result = await this.postsQueryRepository.getPostById(req.params.id, req.userId)
        result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
    }

    async getPosts (req: Request<{},{},{},IQueryInputModel>, res: Response<IPaginator<IPostViewModel>>) {
        const query = getQueryParams(req.query)

        const result = await this.postsQueryRepository.getPosts(query, req.userId)

        res.status(StatusCodes.OK).send(result)
    }

    async updatePostById (req: Request<{ id: string }, {}, IPostInputModel>, res: Response) {
        const result = await this.postsService.updatePost(req.params.id, req.body)
        result ? res.status(StatusCodes.NO_CONTENT).json() : res.status(StatusCodes.NOT_FOUND).json()
    }

    async likePost(req: Request<{postId: string}, {}, ILikeInputModel>, res: Response) {
        const likePostResult = await this.postsService.likePost(req.params.postId, req.userId || '', req.body.likeStatus)

        if (likePostResult.status === ResultStatus.Success) {
            res.status(StatusCodes.NO_CONTENT).send()
        }
        if (likePostResult.status === ResultStatus.NotFound) {
            res.status(StatusCodes.NOT_FOUND).send()
        }
    }
}