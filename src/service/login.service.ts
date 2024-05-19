import {bcryptService} from '../common/adapters/bcrypt.service'
import {usersRepository} from '../repositories/users/users.repository'
import {ILoginInputModel} from '../features/auth/models/loginInput.model'
import {ResultType} from '../common/types/result.type'
import {ResultStatus} from '../common/types/resultStatus.type'
import {IUserInputModel} from '../features/users/models/userInput.model'
import {emailService} from '../common/adapters/email.service'
import {db} from '../db/db'
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns'
import {SETTINGS} from '../common/config/settings'
import {usersQueryRepository} from '../repositories/users/usersQuery.repository'
import {jwtService} from "../common/adapters/jwt.service";
import {blockListRepository} from "../repositories/blockList/blockList.repository";
import {postsQueryRepository} from "../repositories/posts/postsQuery.repository";

export const loginService = {
    async registrationUser(data: IUserInputModel): Promise<ResultType> {
        const passwordHash = await bcryptService.createPasswordHash(data.password)
        const user = await usersRepository.createUser(data, passwordHash)

        if (user) {
            const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
						 <a href='https://ab.com?code=${user.confirmationCode}'>complete registration</a>
				 </p>
			`
            try {
                emailService.sendConfirmationCode(data.email, 'Confirmation code', html)
            } catch (e) {
                console.error(`some problems with send confirm code ${e}`)
            }

            return {
                status: ResultStatus.Success,
                data: null
            }
        } else {
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }
    },
    async confirmationCode(code: string): Promise<ResultType> {
        await usersRepository.updateUserConfirm(code)
        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async resendConfirmationCode(email: string): Promise<ResultType> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(email)

        if (user) {
            const code = uuidv4()
            const confirmationCodeExpiredNew = add(new Date(), SETTINGS.EXPIRED_LIFE)
            await db.getCollection().usersCollection.updateOne(
                {_id: user._id},
                {
                    $set:
                        {
                            confirmationCode: code,
                            confirmationCodeExpired: confirmationCodeExpiredNew
                        }
                })

            const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
						 <a href='https://ab.com?code=${code}'>complete registration</a>
				 </p>
			`
            try {
                emailService.sendConfirmationCode(user.email, 'Confirmation code', html)
            } catch (e) {
                console.error(`some problems with send confirm code ${e}`)
            }

            return {
                status: ResultStatus.Success,
                data: null
            }
        } else return {
            status: ResultStatus.NotFound,
            data: null
        }
    },
    async loginUser(data: ILoginInputModel): Promise<ResultType<{ accessToken: string, refreshToken: string } | null>> {
        const user = await usersQueryRepository.findUserWithPass(data.loginOrEmail)

        if (!user) {
            return {
                data: null,
                status: ResultStatus.NotFound
            }
        } else {
            const isTrueHash = await bcryptService.comparePasswordsHash(data.password, user.password)

            const accessToken = jwtService.createAccessToken(user!._id)
            const refreshToken = jwtService.createRefreshToken(user!._id)

            return {
                status: isTrueHash ? ResultStatus.Success : ResultStatus.BadRequest,
                data: isTrueHash ? {accessToken, refreshToken} : null
            }
        }
    },
    async logout(refreshToken: string): Promise<ResultType> {
        const isValidToken = jwtService.checkRefreshToken(refreshToken)
        const userId = jwtService.getUserIdByToken(refreshToken)
        const isBlocked = await blockListRepository.checkTokenIsBlocked(refreshToken)
        if (isValidToken && !isBlocked) {
            const isAddInBlock = await blockListRepository.addRefreshTokenInBlackList(refreshToken)
            return isAddInBlock
                ?  {
                    status: ResultStatus.Success,
                    data: null
                }
                : {
                    status: ResultStatus.BadRequest,
                    data: null
                }
        }
        return {
            status: ResultStatus.NotFound,
            data: null
        }
    },
    async refreshToken(refreshToken: string): Promise<ResultType<{accessToken: string, refreshToken: string} | null>> {
        const isValidToken = jwtService.checkRefreshToken(refreshToken)
        const BlockList = await db.getCollection().blockListCollection.find({refreshToken: refreshToken}).toArray()

        if (BlockList.length > 0) {
            return {
                status: ResultStatus.Forbidden,
                data: null
            }
        }

        if (!isValidToken) {
            const result = await db.getCollection().blockListCollection.insertOne({refreshToken: refreshToken})
            if (result.acknowledged) {
                return {
                    status: ResultStatus.Unauthorized,
                    data: null
                }
            } else {
                return {
                    status: ResultStatus.BadRequest,
                    errorMessage: 'problem with add token in document',
                    data: null
                }
            }
        }

        const userId = jwtService.getUserIdByToken(refreshToken)

        if (!userId) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        const result = await db.getCollection().blockListCollection.insertOne({refreshToken: refreshToken})
        const newAccessToken = jwtService.createAccessToken(userId)
        const newRefreshToken = jwtService.createRefreshToken(userId)

        return {
            status: ResultStatus.Success,
            data: {accessToken: newAccessToken, refreshToken: newRefreshToken }
        }

    }
}
