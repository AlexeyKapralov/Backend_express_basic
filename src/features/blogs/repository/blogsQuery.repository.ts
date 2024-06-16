import {IPaginator} from '../../../common/types/paginator'
import {IBlogViewModel} from '../models/blogView.model'
import {IPostViewModel} from '../../posts/models/postView.model'
import {IQueryOutputModel, SortDirection} from '../../../common/types/query.model'
import {getBlogViewModel} from "../mappers/blogsMappers";
import {getPostViewModel} from "../../posts/mappers/postMappers";
import {BlogModel} from "../domain/blogs.entity";
import {PostModel} from "../../posts/domain/post.entity";
import {LikesPostsModel} from "../../likes/domain/likesForPosts.entity";
import {ILikePostsDbModel, LikeStatus} from "../../likes/models/like.type";
import {likePostsMapper} from "../../likes/mappers/likePosts.mapper";

export const blogsQueryRepository = {
    async getBlogs(query: IQueryOutputModel): Promise<IPaginator<IBlogViewModel>> {

        const newQuery = {name: {$regex: query.searchNameTerm ?? '', $options: 'i'}}

        const res = await BlogModel
            .find(newQuery)
            .sort({[query.sortBy!]: query.sortDirection as SortDirection})
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)
            .lean()

        const countDocs = await BlogModel
            .countDocuments(newQuery)

        return {
            pagesCount: Math.ceil(countDocs / query.pageSize!),
            page: query.pageNumber!,
            pageSize: query.pageSize!,
            totalCount: countDocs,
            items: res.map(getBlogViewModel)
        }
    },

    async getBlogByID(id: string) {
        const result = await BlogModel.findOne({
            _id: id
        })
        return result ? getBlogViewModel(result) : undefined
    },

    async getPostsByBlogID(id: string, query: IQueryOutputModel, userId: string | null): Promise<IPaginator<IPostViewModel> | undefined> {

        const posts = await PostModel
            .find({blogId: id})
            .sort({[query.sortBy!]: query.sortDirection as SortDirection})
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)
            .lean()

        const countDocs = await PostModel
            .countDocuments({blogId: id})

        //todo как-будто бы эту логику можно вынести в отдельный блок, т.к. она много где повторяется
        let newPosts: IPostViewModel[] = []
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

        newPosts.sort(function (a, b) {
            if (a.createdAt < b.createdAt) {
                return 1;
            }
            if (a.createdAt > b.createdAt) {
                return -1;
            }
            return 0;
        });

        if (posts.length > 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize!),
                page: query.pageNumber!,
                pageSize: query.pageSize!,
                totalCount: countDocs,
                items: newPosts
            }
        } else {
            return undefined
        }
    }
}
