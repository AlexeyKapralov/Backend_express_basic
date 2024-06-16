import {IPostInputModel} from "../models/postInput.model";
import {ObjectId, WithId} from "mongodb";
import {IPostDbModel} from "../models/postDb.model";
import {IPostViewModel} from "../models/postView.model";
import {getPostViewModel} from "../mappers/postMappers";
import {PostModel} from "../domain/post.entity";
import {BlogsRepository} from "../../blogs/repository/blogs.repository";
import {inject, injectable} from "inversify";
import {LikeStatus} from "../../likes/models/like.type";
import {LikesPostsModel} from "../../likes/domain/likesForPosts.entity";
import {UsersModel} from "../../users/domain/user.entity";

@injectable()
export class PostsRepository {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }
    async getPostById(id: string): Promise<WithId<IPostDbModel> | undefined> {
        const result = await PostModel.findOne({
            _id: id
        })
        return result ? result : undefined
    }
    async createPost(body: IPostInputModel, blogName: string): Promise<IPostViewModel | undefined> {
        const newPost: WithId<IPostDbModel> = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
            dislikesCount: 0,
            likesCount: 0
        }
        const result = await PostModel.create(newPost)
        return !!result ? getPostViewModel(newPost, [], LikeStatus.None) : undefined
    }
    async updatePost(id: string, body: IPostInputModel): Promise<boolean> {

        const foundBlog = await this.blogsRepository.getBlogByID(body.blogId)

        if (foundBlog) {

            const result = await PostModel.updateOne({
                _id: id
            }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName: foundBlog!.name
                }
            })

            return result.matchedCount > 0
        } else return false
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: id})
        return result.deletedCount > 0
    }
    async likePost(postId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
        //найти юзера
        //найти пост
        let user = null
        let post = null
        try {
            user = await UsersModel.findOne({_id: userId})
            post = await PostModel.findOne({_id: postId})
        } catch {
            return false
        }

        //проверка есть ли он
        if (!post || !user) {
            return false
        }
        //есть ли у юзера лайк/дизлайк
        //нет - создать, да изменить статус
        let like = await LikesPostsModel.findOne({postId: postId, userId: userId})
        let isNewLike = false
        if (!like) {
            like = await LikesPostsModel.initLikePost(LikeStatus.None, userId, postId, user.login)
            isNewLike = true
        }

        //todo возможно стоит убрать в likePostsEntity
        //изменить в постах колво лойков дизлайков
        if (likeStatus === like.description) {
            return true
        }

        switch(true) {
            case (likeStatus === LikeStatus.Like && like.description === LikeStatus.Dislike) :
                await like.setDescription(likeStatus)
                await post.addCountLikes(1)
                await post.addCountDislikes(-1)
                break
            case (likeStatus === LikeStatus.Like && like.description === LikeStatus.None):
                await like.setDescription(likeStatus)
                await post.addCountLikes(1)
                // post.addCountDislikes(0)
                break
            case (likeStatus === LikeStatus.Dislike && like.description === LikeStatus.Like):
                await like.setDescription(likeStatus)
                await post.addCountLikes(-1)
                await post.addCountDislikes(1)
                break
            case (likeStatus === LikeStatus.Dislike && like.description === LikeStatus.None):
                await like.setDescription(likeStatus)
                // post.addCountLikes(0)
                await post.addCountDislikes(1)
                break
            case (likeStatus === LikeStatus.None && like.description === LikeStatus.Like):
                await like.setDescription(likeStatus)
                await post.addCountLikes(-1)
                // post.addCountDislikes(0)
                break
            case (likeStatus === LikeStatus.None && like.description === LikeStatus.Dislike):
                await like.setDescription(likeStatus)
                // post.addCountLikes(0)
                await post.addCountDislikes(-1)
                break
            default:
                break
        }
        return true

    }
}