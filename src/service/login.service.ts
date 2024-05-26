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
import {jwtService} from "../common/adapters/jwt.service";
import {IDeviceModel} from "../common/types/devices.model";
import {devicesRepository} from "../repositories/devices/devices.repository";
import {devicesService} from "./devicesService";

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

        const user = await usersRepository.findUserByLoginOrEmail(email)

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
    async loginUser(data: ILoginInputModel, deviceName: string, ip: string): Promise<ResultType<{
        accessToken: string,
        refreshToken: string
    } | null>> {
        const user = await usersRepository.findUserWithPass(data.loginOrEmail)

        if (!user) {
            return {
                data: null,
                status: ResultStatus.NotFound
            }
        } else {
            const isTrueHash = await bcryptService.comparePasswordsHash(data.password, user.password)
            const deviceId = await devicesRepository.findDeviceId(user._id, ip, deviceName)

            const device: Omit<IDeviceModel, 'iat' | 'expirationDate'> = {
                userId: user._id,
                deviceId: deviceId === null ? uuidv4() : deviceId!,
                deviceName: deviceName,
                ip: ip
            }

            const accessToken = jwtService.createAccessToken(user._id)
            const refreshToken = jwtService.createRefreshToken(device)

            if (isTrueHash) {
                const refreshTokenPayload = jwtService.getPayloadFromRefreshToken(refreshToken)

                if (await devicesRepository.createOrUpdateDevice(refreshTokenPayload!)) {
                    return {
                        status: ResultStatus.Success,
                        data: {accessToken, refreshToken}
                    }
                } else {
                    return {
                        status: ResultStatus.BadRequest,
                        data: null
                    }
                }
            } else {
                return {
                    status: ResultStatus.BadRequest,
                    data: null
                }
            }


        }
    },
    async logout(refreshToken: string): Promise<ResultType> {
        const deviceData = jwtService.getPayloadFromRefreshToken(refreshToken)

        if (!deviceData) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'invalid refresh token',
                data: null
            }
        }

        const currentDevice =  await devicesService.getDevice(deviceData)

        if (!deviceData || currentDevice.status === ResultStatus.NotFound) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'invalid refresh token',
                data: null
            }
        }

        const isDeleted = await devicesRepository.deleteDeviceById(deviceData.deviceId)

        return isDeleted
            ? {
                status: ResultStatus.Success,
                data: null
            }
            : {
                status: ResultStatus.BadRequest,
                data: null
            }
    },
    async refreshToken(refreshToken: string): Promise<ResultType<{
        accessToken: string,
        refreshToken: string
    } | null>> {

        const deviceInfo = jwtService.getPayloadFromRefreshToken(refreshToken)

        if (!deviceInfo) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        let device = await devicesRepository.findDevice(deviceInfo)
        if (!device) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        if (deviceInfo) {
            device = await db.getCollection().devices.findOne({
                deviceId: deviceInfo.deviceId,
                ip: deviceInfo.ip,
                iat: deviceInfo.iat,
                expirationDate: deviceInfo.expirationDate,
                userId: deviceInfo.userId
            })
        }

        if (device) {

            const newAccessToken = jwtService.createAccessToken(device.userId)
            const newRefreshToken = jwtService.createRefreshToken({
                userId: device.userId,
                deviceName: device.deviceName,
                deviceId: device.deviceId,
                ip: device.ip
            })

            const newDevice = jwtService.getPayloadFromRefreshToken(newRefreshToken)

            await devicesRepository.createOrUpdateDevice(newDevice!)

            return {
                status: ResultStatus.Success,
                data: {accessToken: newAccessToken, refreshToken: newRefreshToken}
            }
        }

        return {
            status: ResultStatus.Unauthorized,
            data: null
        }
    }
}
