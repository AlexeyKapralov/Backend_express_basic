import {inject, injectable} from "inversify";
import {AuthService} from "./service/auth.service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ResultStatus} from "../../common/types/resultStatus.type";
import {IMeViewModel} from "./models/meView.model";
import {getUserInfo} from "../users/mappers/userMappers";
import {ILoginInputModel} from "./models/loginInput.model";
import {ILoginSuccessViewModel} from "../../common/types/loginSuccessView.model";
import {ResultType} from "../../common/types/result.type";
import {addSeconds} from "date-fns";
import {JwtService} from "../../common/adapters/jwtService";
import {newPasswordRecoveryInputModel} from "./models/newPasswordRecoveryInput.model";
import {UsersQueryRepository} from "../users/repository/usersQuery.repository";
import {setCookie} from "../../common/utils/generators";
import {IUserInputModel} from "../users/models/userInput.model";
import {IRegistrationConfirmationCodeModel} from "./models/registrationConfirmationCode.model";

@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) protected authService: AuthService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(JwtService) protected jwtService: JwtService
    ) {}

    async emailResending (req:Request<{},{},{email: string}>, res:Response<StatusCodes>) {

        const result = await this.authService.resendConfirmationCode(req.body.email)

        result.status === ResultStatus.Success ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
    }

    async getUserInfo (req: Request, res: Response<IMeViewModel>) {
        const user = await this.usersQueryRepository.findUserById(req.userId!)

        user ? res.status(StatusCodes.OK).json(getUserInfo(user!)) : res.status(StatusCodes.NOT_FOUND).json()
    }

    async login (
        req: Request<{}, {}, ILoginInputModel>,
        res: Response<ILoginSuccessViewModel>
    ) {
        const result: ResultType<{ accessToken: string; refreshToken: string } | null> =
            await this.authService.loginUser(
                req.body,
                req.headers['user-agent'] || 'unknown Device Name',
                req.ip || 'Unknown IP'
            )

        result.status === ResultStatus.Success
            ? res
                .cookie('refreshToken', result.data!.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    expires: addSeconds(new Date(), 20)
                })
                .status(StatusCodes.OK).json(
                    {
                        accessToken: result.data!.accessToken
                    })

            : res
                .status(StatusCodes.UNAUTHORIZED).send()
    }

    async logout (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken

        const tokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken)

        const result = await this.authService.logout(tokenPayload!.deviceId, tokenPayload!.userId, tokenPayload!.iat)

        if (result.status === ResultStatus.Success) {
            res.status(StatusCodes.NO_CONTENT).json()
        }
        if (result.status === ResultStatus.BadRequest) {
            res.status(StatusCodes.UNAUTHORIZED).json()
        }
        if (result.status === ResultStatus.Unauthorized) {
            res.status(StatusCodes.UNAUTHORIZED).json(result.errorMessage)
        }
    }

    async newPassword (req: Request<{},{},newPasswordRecoveryInputModel>, res: Response) {
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode

        const updatedPasswordStatus = await this.authService.setNewPassword(recoveryCode, newPassword)

        if (updatedPasswordStatus.status === ResultStatus.Success) {
            res.status(StatusCodes.NO_CONTENT).send()
            return
        }
        res.status(StatusCodes.BAD_REQUEST).send()

    }

    async passwordRecovery (req: Request<{}, {}, {email: string}>, res: Response) {
        const email = req.body.email

        const user = await this.usersQueryRepository.findUserByLoginOrEmail(email)

        if (!user) {
            res.status(StatusCodes.NO_CONTENT).json()
            return
        }

        const recoveryStatus = await this.authService.recoveryPassword(email)
        switch(recoveryStatus.status) {
            case ResultStatus.NotFound:  // if (x === 'value1')
                res.status(StatusCodes.NO_CONTENT).send()
                break
            case ResultStatus.BadRequest:
                res.status(StatusCodes.BAD_REQUEST).send()
                break
            default:
                res.status(StatusCodes.NO_CONTENT).send()
                break
        }
    }

    async refreshToken (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken

        const tokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken)
        if (!tokenPayload) {
            res.status(StatusCodes.UNAUTHORIZED).json()
            return
        }

        const result = await this.authService.refreshToken(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat)
        if (result.status === ResultStatus.Success) {
            setCookie(res, result.data!.refreshToken)
            res.status(StatusCodes.OK)
                .send({accessToken: result.data!.accessToken})
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json()
        }
    }

    async registration (req: Request<{},{},IUserInputModel>, res: Response<StatusCodes>) {
        const result = await this.authService.registrationUser(req.body)

        if (result.status === ResultStatus.Success) {
            res.status(StatusCodes.NO_CONTENT).json()
        }
        if (result.status === ResultStatus.BadRequest) {
            res.status(StatusCodes.BAD_REQUEST).json()
        }
    }

    async registrationConfirmation (req: Request<{},{},IRegistrationConfirmationCodeModel>, res:Response) {
        const result = await this.authService.updateUserConfirm(req.body.code)
        result.status === ResultStatus.Success
            ? res.status(StatusCodes.NO_CONTENT).send()
            : res.status(StatusCodes.NOT_FOUND).send()
    }
}