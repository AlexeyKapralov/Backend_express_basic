import {db} from "../../db/db";

export const blockListRepository = {
    async addRefreshTokenInBlackList(token: string) {
        const res = await db.getCollection().blockListCollection.insertOne({refreshToken: token})
        return res.acknowledged
    },
    async checkTokenIsBlocked(token: string) {
        const res = await db.getCollection().blockListCollection.findOne({refreshToken: token})
        return res !== null
    }
}