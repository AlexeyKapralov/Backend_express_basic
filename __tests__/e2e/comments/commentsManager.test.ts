import {ICommentDbModel} from "../../../src/features/comments/models/commentDb.model";
import {ObjectId} from "mongodb";
import {db} from "../../../src/db/db";

export const commentsManagerTest = {
    async createComments(count: number, postId: string = 'post') {
        for (let i = 0; i < count; i++) {
            const letter =  String.fromCharCode('A'.charCodeAt(0) + i)
            const comment: ICommentDbModel = {
                _id: new ObjectId().toString(),
                createdAt: new Date().toISOString(),
                content: 'comment' + letter + i,
                commentatorInfo: {
                    userId: 'user' + letter + i,
                    userLogin: `user${letter + i}@example.com`
                },
                postId: postId === 'post'
                    ? `postID`
                    : postId
            }
            await db.getCollection().commentsCollection.insertOne(comment)
        }
    }
}