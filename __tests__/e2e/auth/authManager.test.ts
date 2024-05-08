import { agent } from 'supertest'
import { app } from '../../../src/app'
import { SETTINGS } from '../../../src/common/config/settings'
import { StatusCodes } from 'http-status-codes'
import { ILoginInputModel } from '../../../src/features/auth/models/loginInput.model'
import { userManagerTest } from '../users/userManager.test'
import { IUserInputModel } from '../../../src/features/users/models/userInput.model'

export const authManagerTest = {
	async createAndAuthUser(loginData: 'default' | ILoginInputModel | null = 'default', newUserData: 'default' | IUserInputModel = 'default',
													expectedStatus: StatusCodes = StatusCodes.OK
	): Promise<string | undefined> {

		if (newUserData === 'default') {
			newUserData = {
				'login': 'alexx123',
				'password': '123456',
				'email': 'asdasdas@e.com'
			}
		}
		await userManagerTest.createUser(newUserData, SETTINGS.ADMIN_AUTH)

		let res
		switch (loginData) {
			case 'default': {
				loginData = {
					'loginOrEmail': 'alexx123',
					'password': '123456'
				}
				res = await agent(app)
					.post(`${SETTINGS.PATH.AUTH}/login`)
					.send(loginData)
					.expect(expectedStatus)
				break
			}

			case null: {
				res = await agent(app)
					.post(`${SETTINGS.PATH.AUTH}/login`)
					.expect(expectedStatus)
				break
			}

			default: {
				res = await agent(app)
					.post(`${SETTINGS.PATH.AUTH}/login`)
					.send(loginData)
					.expect(expectedStatus)
			}
		}

		if (expectedStatus === StatusCodes.OK) {
			expect(res.body).toEqual(
				{
					'accessToken': res.body.accessToken
				}
			)

			const getUserByToken = await agent(app)
				.get(`${SETTINGS.PATH.AUTH}/me`)
				.set({ authorization: `Bearer ${res.body.accessToken}`
		})

			expect(getUserByToken.body).toEqual({
				'email': newUserData.email,
				'login': newUserData.login,
				'userId': expect.any(String)
			})
			return res.body.accessToken
		} else {
			return undefined
		}
	},

	async authUser(loginData: 'default' | ILoginInputModel = 'default',
								 expectedStatus: StatusCodes = StatusCodes.OK
	): Promise<{ accessToken: string } | undefined> {

		let res
		if (loginData === 'default') {
			loginData = {
				'loginOrEmail': 'alexx123',
				'password': '123456'
			}
			res = await agent(app)
				.post(`${SETTINGS.PATH.AUTH}/login`)
				.send(loginData)
				.expect(expectedStatus)
		} else {
			res = await agent(app)
				.post(`${SETTINGS.PATH.AUTH}/login`)
				.send(loginData)
				.expect(expectedStatus)
		}

		if (expectedStatus === StatusCodes.OK) {
			expect(res.body).toEqual(
				{
					'accessToken': res.body.accessToken
				}
			)
			return res.body.accessToken
		} else {
			return undefined
		}
	}
}
