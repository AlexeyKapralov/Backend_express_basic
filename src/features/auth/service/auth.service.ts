import {bcryptService} from '../../../common/adapters/bcrypt.service'
import {UsersRepository} from '../../users/repository/users.repository'
import {ILoginInputModel} from '../models/loginInput.model'
import {ResultType} from '../../../common/types/result.type'
import {ResultStatus} from '../../../common/types/resultStatus.type'
import {IUserInputModel} from '../../users/models/userInput.model'
import {emailService} from '../../../common/adapters/email.service'
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns'
import {SETTINGS} from '../../../common/config/settings'
import {jwtService} from "../../../common/adapters/jwt.service";
import {UsersModel} from "../../users/domain/user.entity";
import {IDeviceDbModel} from "../../securityDevices/models/deviceDb.model";
import {IUserDbModel} from "../../users/models/userDb.model";
import {devicesService} from "../../securityDevices/devicesCompositionRoot";
import {DevicesRepository} from "../../securityDevices/repository/devices.repository";

export class AuthService {
    protected usersRepository
    protected devicesRepository

    constructor(usersRepository: UsersRepository, devicesRepository: DevicesRepository) {
        this.usersRepository = usersRepository
        this.devicesRepository = devicesRepository
    }

    async registrationUser(data: IUserInputModel): Promise<ResultType> {
        const passwordHash = await bcryptService.createPasswordHash(data.password)
        const user = await this.usersRepository.createUser(data, passwordHash)

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
    }
    async updateUserConfirm(confirmationCode: string): Promise<ResultType> {
        await this.usersRepository.updateUserConfirm(confirmationCode)
        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async resendConfirmationCode(email: string): Promise<ResultType> {

        const user = await this.usersRepository.findUserByLoginOrEmail(email)

        if (user) {
            const code = uuidv4()
            const confirmationCodeExpiredNew = add(new Date(), SETTINGS.EXPIRED_LIFE)
            await UsersModel.updateOne(
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
    }
    async recoveryPassword(email: string): Promise<ResultType> {
        const user: IUserDbModel | undefined = await this.usersRepository.findUserByLoginOrEmail(email)
        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const confirmationCode = uuidv4()
        const confirmationCodeExpired = add(new Date(), SETTINGS.EXPIRED_LIFE)

        const isUnconfirmed = await this.usersRepository.setUnconfirmed(user._id, confirmationCode, confirmationCodeExpired)
        if (!isUnconfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data:  null
            }
        }

        const html = `
            <h1>Password recovery</h1>
           <p>To finish password recovery please follow the link below:
              <a href='https://somesite.com/password-recovery?recoveryCode=${confirmationCode}'>recovery password</a>
          </p>
        `

        try {
            emailService.sendConfirmationCode(email, 'Password recovery', html)
        } catch (e) {
            console.error(`some problems with send confirm code ${e}`)
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async setNewPassword(recoveryCode: string, password: string): Promise<ResultType> {
        const user = await this.usersRepository.findUserByRecoveryCode(recoveryCode)

        if (!user || user.confirmationCodeExpired < new Date()) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const isNewPassword = bcryptService.comparePasswordsHash(password, user.password)
        if (!isNewPassword) {
            return {
                status: ResultStatus.Forbidden,
                errorMessage: 'password already used',
                data: null
            }
        }

        const passwordHash = await bcryptService.createPasswordHash(password)
        const isUpdatePassword = await this.usersRepository.updatePassword(user._id, passwordHash)

        if (!isUpdatePassword) {
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async loginUser(data: ILoginInputModel, deviceName: string, ip: string): Promise<ResultType<{
        accessToken: string,
        refreshToken: string
    } | null>> {
        const user = await this.usersRepository.findUserWithPass(data.loginOrEmail)
        if (!user) {
            return {
                data: null,
                status: ResultStatus.NotFound
            }
        }
        const isTrueHash = await bcryptService.comparePasswordsHash(data.password, user.password)
        if (!isTrueHash) {
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }

        const deviceId = await this.devicesRepository.findDeviceId(user._id, ip, deviceName)

        const device: Omit<IDeviceDbModel, 'iat' | 'exp'> = {
            userId: user._id,
            deviceId: deviceId === null ? uuidv4() : deviceId!,
            deviceName: deviceName,
            ip: ip
        }

        const accessToken = jwtService.createAccessToken(user._id)
        const refreshToken = jwtService.createRefreshToken(device.deviceId, device.userId)

        const refreshTokenPayload = jwtService.verifyAndDecodeToken(refreshToken)
        if (!refreshTokenPayload) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        const fullDevice: IDeviceDbModel = {
            userId: device.userId,
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            ip: device.ip,
            exp: refreshTokenPayload.exp,
            iat: refreshTokenPayload.iat
        }

        if (await this.devicesRepository.createOrUpdateDevice(fullDevice)) {
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

    }
    async logout(deviceId: string, userId: string, iat: number): Promise<ResultType> {

        const currentDevice =  await devicesService.getDevice(deviceId, userId, iat)

        if (currentDevice.status === ResultStatus.NotFound) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'invalid data',
                data: null
            }
        }

        const isDeleted = await this.devicesRepository.deleteDeviceById(deviceId)

        return isDeleted
            ? {
                status: ResultStatus.Success,
                data: null
            }
            : {
                status: ResultStatus.BadRequest,
                data: null
            }
    }
    async refreshToken(deviceId: string, userId: string, iat: number): Promise<ResultType<{
        accessToken: string,
        refreshToken: string
    } | null>> {

        let device = await this.devicesRepository.findDevice(deviceId, userId, iat)
        if (!device || String(iat) !== device.iat) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        const newAccessToken = jwtService.createAccessToken(device.userId)
        const newRefreshToken = jwtService.createRefreshToken(device.deviceId, device.userId)

        const newPayload = jwtService.verifyAndDecodeToken(newRefreshToken)

        const fullDevice: IDeviceDbModel = {
            userId: device.userId,
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            ip: device.ip,
            exp: newPayload!.exp,
            iat: newPayload!.iat
        }

        const isUpdatedDevice = await this.devicesRepository.createOrUpdateDevice(fullDevice)

        if (isUpdatedDevice) {
            return {
                status: ResultStatus.Success,
                data: {accessToken: newAccessToken, refreshToken: newRefreshToken}
            }
        } else {
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }
    }
}
