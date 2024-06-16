import {WithId} from 'mongodb'
import {IPostViewModel} from '../models/postView.model'
import {IPaginator} from '../../../common/types/paginator'
import {IQueryOutputModel, SortDirection} from '../../../common/types/query.model'
import {getPostViewModel} from "../mappers/postMappers";
import {PostModel} from "../domain/post.entity";
import {IPostDbModel} from "../models/postDb.model";
import {injectable} from "inversify";
import {LikesPostsModel} from "../../likes/domain/likesForPosts.entity";
import {ILikePostsDbModel, LikeStatus} from "../../likes/models/like.type";
import {likePostsMapper} from "../../likes/mappers/likePosts.mapper";

@injectable()
export class PostsQueryRepository {

    //todo глянуть это еще раз свежим взглядом
    async getPosts(query: IQueryOutputModel, userId: string | null): Promise<IPaginator<IPostViewModel>> {
        const posts: WithId<IPostDbModel>[] = await PostModel
            .find()
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)
            .sort({[query.sortBy!]: query.sortDirection as SortDirection})
            .lean()

        // const posts: WithId<IPostDbModel>[] = await PostModel.aggregate([
        //     // { $match: { type: 'product' } },
        //     {$sort: {[query.sortBy!]: query.sortDirection!}},
        //     {$skip: (query.pageNumber! - 1) * query.pageSize!},
        //     {$limit: query.pageSize!},
        //     {
        //         $lookup: {
        //             from: 'likesPosts',
        //             localField: '_id',
        //             foreignField: 'parentId',
        //             as: 'extendedLikesInfo'
        //         }
        //     }
        // ])

        const newPosts: IPostViewModel[] = []
        await Promise.all(
            posts.map(
                async post => {
                    const newestLikes = await LikesPostsModel
                        .find({postId: post._id, description: LikeStatus.Like})
                        .sort({addedAt: SortDirection.descending})
                        .limit(3)
                        .lean()

                    const newestLikesMapped = newestLikes.map(likePostsMapper)

                    let currentUserLike: ILikePostsDbModel | null = null
                    if (userId) {
                        currentUserLike = await LikesPostsModel
                            .findOne({postId: post._id.toString(), userId: userId})
                            .lean()
                    }

                    const currentUserLikeStatus: LikeStatus = currentUserLike ? currentUserLike.description as LikeStatus : LikeStatus.None
                    const newPost = getPostViewModel(post, newestLikesMapped, currentUserLikeStatus)
                    newPosts.push(newPost)
                }
            )
        )
        //descending sort
        newPosts.sort(function (a, b) {
            if (a.createdAt < b.createdAt) {
                return 1;
            }
            if (a.createdAt > b.createdAt) {
                return -1;
            }
            return 0;
        });

        const countDocs = await PostModel.countDocuments()

        return {
            pagesCount: Math.ceil(countDocs / query.pageSize!),
            page: query.pageNumber!,
            pageSize: query.pageSize!,
            totalCount: countDocs,
            items: newPosts
        }

    }

    async getPostById(postId: string, userId: string | null): Promise<IPostViewModel | undefined> {

        let userPostLikeStatus: LikeStatus = LikeStatus.None
        if (userId !== null) {
            const userPostLike = await LikesPostsModel.findOne({userId, postId}).lean()
            if (userPostLike) {
                userPostLikeStatus = userPostLike.description as LikeStatus
            }
        }

        const newestLikes = await LikesPostsModel
            .find({postId: postId, description: LikeStatus.Like})
            .sort({addedAt: SortDirection.descending})
            .limit(3)
            .lean()

        const newestLikesMapped = newestLikes.map(likePostsMapper)

        const result: WithId<IPostDbModel> | null = await PostModel.findOne({
            _id: postId
        })
        return result ? getPostViewModel(result, newestLikesMapped, userPostLikeStatus) : undefined
    }
}