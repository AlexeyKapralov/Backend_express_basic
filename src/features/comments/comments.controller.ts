import {Request, Response} from "express";
import {ICommentInputModel} from "./models/commentInput.model";
import {ResultStatus} from "../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {inject, injectable} from "inversify";
import {CommentsService} from "./service/comments.service";
import {ICommentViewModel} from "./models/commentView.model";
import {JwtService} from "../../common/adapters/jwtService";
import {UsersQueryRepository} from "../users/repository/usersQuery.repository";
import {CommentsQueryRepository} from "./repository/commentsQuery.repository";
import {ILikeCommentsDbModel, ILikeInputModel} from "../likes/models/like.type";

@injectable()
export class CommentsController {

    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {
    }

    async updateCommentById (req: Request<{commentId:string}, {},ICommentInputModel>, res: Response) {
        const result = await this.commentsService.updateComment(req.userId!, req.params.commentId, req.body)

        switch (result.status) {
            case ResultStatus.Success:
                res.status(StatusCodes.NO_CONTENT).json(result.data)
                break
            case ResultStatus.NotFound:
                res.status(StatusCodes.NOT_FOUND).json()
                break
            case ResultStatus.Forbidden:
                res.status(StatusCodes.FORBIDDEN).json()
                break
            default:
                res.status(StatusCodes.BAD_REQUEST).json()
        }
    }

    async deleteCommentById (req: Request<{commentId: string}>, res:Response) {
        const result = await this.commentsService.deleteComment(req.userId!, req.params.commentId)

        switch (result.status) {
            case ResultStatus.Success:
                res.status(StatusCodes.NO_CONTENT).json()
                break
            case ResultStatus.NotFound:
                res.status(StatusCodes.NOT_FOUND).json()
                break
            case ResultStatus.Forbidden:
                res.status(StatusCodes.FORBIDDEN).json()
                break
            default:
                res.status(StatusCodes.BAD_REQUEST).json()
        }
    }

    async getCommentById (req: Request<{commentId:string}>, res: Response<ICommentViewModel>) {

        const token = req.headers.authorization?.split(' ')[1] || null
        const userId = this.jwtService.getUserIdByToken(token || '')

        let result
        if (userId) {
            result = await this.usersQueryRepository.findUserById(userId.toString())
        }

        let comment
        if (result) {
            comment = await this.commentsQueryRepository.getCommentById(req.params.commentId, result!.id)
        } else {
            comment = await this.commentsQueryRepository.getCommentById(req.params.commentId)
        }

        comment
            ? res.status(StatusCodes.OK).send(comment)
            : res.status(StatusCodes.NOT_FOUND).send()

    }

    async likeStatusController (req: Request<{commentId: string}, {}, ILikeInputModel>, res: Response) {
        const comment = await this.commentsQueryRepository.getCommentById(req.params.commentId)
        if (!comment) {
            res.status(StatusCodes.NOT_FOUND).send()
            return
        }

        const likeData: ILikeCommentsDbModel = {
            status: req.body.likeStatus,
            userId: req.userId!,
            createdAt: new Date()
        }

        const isUpdatedLikeStatus = await this.commentsService.updateLikeStatus(comment.id, likeData)

        isUpdatedLikeStatus.status === ResultStatus.Success
            ? res.status(StatusCodes.NO_CONTENT).send()
            : res.status(StatusCodes.NOT_FOUND).send()
    }
}