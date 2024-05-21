"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('refresh token test', () => {
    it('should refresh token', () => {
    });
});
//
// async refreshToken(refreshToken: string): Promise<ResultType<{accessToken: string, refreshToken: string} | null>> {
//         const isValidToken = jwtService.checkRefreshToken(refreshToken)
//         const isNotBlockList = await db.getCollection().blockListCollection.find({refreshToken: refreshToken}).toArray()
//
//         if (isNotBlockList.length > 0) {
//             return {
//                 status: ResultStatus.Forbidden,
//                 data: null
//             }
//         }
//
//         if (!isValidToken) {
//             const result = await db.getCollection().blockListCollection.insertOne({refreshToken: refreshToken})
//             if (result.acknowledged) {
//                 return {
//                     status: ResultStatus.Unauthorized,
//                     data: null
//                 }
//             } else {
//                 return {
//                     status: ResultStatus.BadRequest,
//                     errorMessage: 'problem with add token in document',
//                     data: null
//                 }
//             }
//         }
//
//         const userId = jwtService.getUserIdByToken(refreshToken)
//
//         if (!userId) {
//             return {
//                 status: ResultStatus.NotFound,
//                 data: null
//             }
//         }
//         const result = await db.getCollection().blockListCollection.insertOne({refreshToken: refreshToken})
//         const newAccessToken = jwtService.createAccessToken(userId)
//         const newRefreshToken = jwtService.createRefreshToken(userId)
//
//         return {
//             status: ResultStatus.Success,
//             data: {accessToken: newAccessToken, refreshToken: newRefreshToken }
//         }
//
//     }
//
