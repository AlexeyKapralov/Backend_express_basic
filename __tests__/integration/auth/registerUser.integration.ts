import {MongoMemoryServer} from 'mongodb-memory-server'
import {db} from '../../../src/db/db'
import {IUserInputModel} from '../../../src/features/users/models/userInput.model'
import {ResultType} from '../../../src/common/types/result.type'
import {ResultStatus} from '../../../src/common/types/resultStatus.type'
import {UsersModel} from "../../../src/features/users/domain/user.entity";
import {container} from "../../../src/ioc";
import {EmailService} from "../../../src/common/adapters/email.service";
import {AuthService} from "../../../src/features/auth/service/auth.service";

describe('Integration Auth', () => {

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

    afterAll(done => {
        done()
    })

    it('should create tokens', async () => {
        const data: IUserInputModel = {
            login: 'qwerty',
            email: 'alewka24@gmail.com',
            password: 'qwerty1234@'
        }

        // const emailService = container.resolve(EmailService)
        const authService = container.get(AuthService)
        const mockMailService = jest.spyOn(EmailService.prototype, 'sendConfirmationCode').mockImplementation((email: string, subject: string, confirmationCode: string) => {
            return true
        })
        // emailService.sendConfirmationCode = jest.fn().mockImplementation((email:string, subject:string, confirmationCode:string)=>{
        // 	return true
        // })

        const result: ResultType = await authService.registrationUser(data)

        expect(result).toEqual({
            status: ResultStatus.Success,
            data: null
        })

        const dbUser = UsersModel.find({login: data.login, email: data.email})

        expect(dbUser).toBeDefined()

        expect(mockMailService).toHaveBeenCalled()
        expect(mockMailService).toHaveBeenCalledTimes(1)

    })
})