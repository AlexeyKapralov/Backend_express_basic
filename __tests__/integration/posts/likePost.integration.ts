import {userManagerTest} from "../../e2e/users/userManager.test";
import {SETTINGS} from "../../../src/common/config/settings";
import {postsManagerTest} from "../../e2e/posts/postsManager.test";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {container} from "../../../src/ioc";
import {PostsRepository} from "../../../src/features/posts/repository/posts.repository";
import {LikeStatus} from "../../../src/features/likes/models/like.type";
import {jest} from "@jest/globals";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {PostModel} from "../../../src/features/posts/domain/post.entity";
import {LikesPostsModel} from "../../../src/features/likes/domain/likesForPosts.entity";

describe('like post integration test', () => {

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    beforeEach(async () => {
        await db.drop()
    })

    afterAll(async () => {
        await db.stop()
    })

    it('should like post', async () => {
        const postsRepository = container.get(PostsRepository)

        const user = await userManagerTest.createUser('default', SETTINGS.ADMIN_AUTH)
        const tokens = await authManagerTest.createAndAuthUser()
        const post = await postsManagerTest.createPost('default', tokens!.accessToken)

        const isLiked = await postsRepository.likePost(post!.id, user!.id, LikeStatus.Like)
        expect(isLiked).not.toBeFalsy()

        const likedPost = await PostModel.findOne({_id: post!.id}, {_id: 0}).lean()
        expect(likedPost).toEqual({
           __v: 0,
            // _id: expect.any(String),
           blogId: expect.any(String),
           blogName: expect.any(String),
           content: expect.any(String),
           createdAt: expect.stringMatching(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/),
           dislikesCount: 0,
           likesCount: 1,
           shortDescription: expect.any(String),
           title: expect.any(String),
        })

        const like = await LikesPostsModel.findOne({postId: post!.id}, {_id: 0}).lean()
        expect(like).toEqual({
               __v: 0,
               addedAt: expect.any(Date),
               description: "Like",
               login: expect.any(String),
               postId: expect.any(String),
               userId: expect.any(String),
        })
    });
})