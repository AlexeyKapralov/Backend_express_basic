import {MongoMemoryServer} from 'mongodb-memory-server'
import {db} from '../../../src/db/db'
import {IUserInputModel} from '../../../src/features/users/models/userInput.model'
import {emailService} from '../../../src/common/adapters/email.service'
import {ResultType} from '../../../src/common/types/result.type'
import {ResultStatus} from '../../../src/common/types/resultStatus.type'
import {UsersModel} from "../../../src/features/users/domain/user.entity";
import {authService} from "../../../src/features/auth/authCompositionRoot";

describe('Integration Auth', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})

	beforeEach(async ()=>{
		await db.drop()
		emailService.sendConfirmationCode = jest.fn().mockImplementation((email:string, subject:string, confirmationCode:string)=>{
			return true
		})
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
		const result:ResultType = await authService.registrationUser(data)

		expect(result).toEqual({
			status: ResultStatus.Success,
			data: null
		})

		const dbUser = UsersModel.find({login: data.login, email: data.email})

		expect(dbUser).toBeDefined()

		expect(emailService.sendConfirmationCode).toHaveBeenCalled()
		expect(emailService.sendConfirmationCode).toHaveBeenCalledTimes(1)

	})
})