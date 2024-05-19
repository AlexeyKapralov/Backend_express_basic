import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {postsService} from "../../../src/service/posts.service";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {blogsManagerTest} from "../../e2e/blogs/blogsManager.test";
import {postsManagerTest} from "../../e2e/posts/postsManager.test";
import {jwtService} from "../../../src/common/adapters/jwt.service";
import {ResultType} from "../../../src/common/types/result.type";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";
import {ICommentViewModel} from "../../../src/features/comments/models/commentView.model";
import {ICommentatorInfo} from "../../../src/features/comments/models/commentatorInfo.model";
import {commentsService} from "../../../src/service/comments.service";

describe('comments integration tests', () => {
    let accessToken
    let blog
    let post

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    beforeEach(async () => {
        await db.drop()
        accessToken = await authManagerTest.createAndAuthUser()
        blog = await blogsManagerTest.createBlog('default', accessToken ? accessToken : ' ')
        post = await postsManagerTest.createPost('default', accessToken ? accessToken : ' ')
    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })

    it('should create comment', async () => {
        const body = {
            content: 'aaaa'
        }
        const userId = jwtService.getUserIdByToken(accessToken!)
        const result = await postsService.createComment(
            userId!, post!.id, body
        )
        expect(result).toEqual<ResultType>({
            status: ResultStatus.Success,
            data: expect.objectContaining<ICommentViewModel>({
                id: expect.any(String),
                content: body.content,
                createdAt: expect.stringMatching((/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)),
                commentatorInfo: expect.objectContaining<ICommentatorInfo>({
                    userId: userId!,
                    userLogin: expect.any(String),
                })
            })
        })
    })


    it(`shouldn't update comment with another user`, async () => {
        const body = {
            content: 'aaabbb'
        }
        const userId = jwtService.getUserIdByToken(accessToken!)
        const result = await postsService.createComment(
            userId!, post!.id, body
        )

        const newBody = {
            content: 'ccc'
        }
        let isUpdated
        if (result.data !== null) {
            isUpdated = await commentsService.updateComment('userId!', result.data.id, newBody)
        }

        expect(isUpdated!.status).toBe(ResultStatus.NotFound)
    })

    it('should update comment', async () => {
        const body = {
            content: 'aaabbb'
        }
        const userId = jwtService.getUserIdByToken(accessToken!)
        const result = await postsService.createComment(
            userId!, post!.id, body
        )

        const newBody = {
            content: 'ccc'
        }
        if (result.data !== null) {
            await commentsService.updateComment(userId!, result.data.id, newBody)
        }
        const updatedComment = await db.getCollection().commentsCollection.findOne({_id: result.data!.id})

        expect(updatedComment!.content).toBe(newBody.content)
    })

    it(`shouldn't delete comment with another userId`, async () => {
        const body = {
            content: 'aaabbb'
        }
        const userId = jwtService.getUserIdByToken(accessToken!)
        const result = await postsService.createComment(
            userId!, post!.id, body
        )
        let isDeleted
        if (result.data !== null) {
            isDeleted = await commentsService.deleteComment('userId!', result.data.id)
        }

        expect(isDeleted!.status).toBe(ResultStatus.NotFound)
    })

    it('should delete comment', async () => {
        const body = {
            content: 'aaabbb'
        }
        const userId = jwtService.getUserIdByToken(accessToken!)
        const result = await postsService.createComment(
            userId!, post!.id, body
        )
        if (result.data !== null) {
            await commentsService.deleteComment(userId!, result.data.id)
        }
        const isDeleted = await db.getCollection().commentsCollection.findOne({_id: result.data!.id})

        expect(isDeleted).toBe(null)
    })
})