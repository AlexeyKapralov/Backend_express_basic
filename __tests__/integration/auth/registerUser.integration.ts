import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../../src/db/db'
import { loginService } from '../../../src/features/auth/service/login.service'
import { IUserInputModel } from '../../../src/features/users/models/userInput.model'
import { emailService } from '../../../src/common/adapters/email.service'
import { ResultType } from '../../../src/common/types/result.type'
import { ResultStatus } from '../../../src/common/types/resultStatus.type'

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
		const result:ResultType = await loginService.registrationUser(data)

		expect(result).toEqual({
			status: ResultStatus.Success,
			data: null
		})

		const dbUser = db.getCollection().usersCollection.find({login: data.login, email: data.email})

		expect(dbUser).toBeDefined()

		expect(emailService.sendConfirmationCode).toHaveBeenCalled()
		expect(emailService.sendConfirmationCode).toHaveBeenCalledTimes(1)

	})
})