import {Request, Response} from 'express'
import {commentsQueryRepository} from "../repository/commentsQuery.repository";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {ILikeDbModel, ILikeInputModel} from "../models/commentDb.model";
import {commentsService} from "../commentsCompositionRoot";

export const likeStatusController = async (req: Request<{commentId: string}, {}, ILikeInputModel>, res: Response) => {
    const comment = await commentsQueryRepository.getCommentById(req.params.commentId)
    if (!comment) {
        res.status(StatusCodes.NOT_FOUND).send()
        return
    }

    const likeData: ILikeDbModel = {
        status: req.body.likeStatus,
        userId: req.userId!,
        createdAt: new Date()
    }

    const isUpdatedLikeStatus = await commentsService.updateLikeStatus(comment.id, likeData)

    isUpdatedLikeStatus.status === ResultStatus.Success
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).send()
}