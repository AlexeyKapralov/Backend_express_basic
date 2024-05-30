import { agent } from 'supertest'
import { app } from '../../../src/app'
import { SETTINGS } from '../../../src/common/config/settings'
import { StatusCodes } from 'http-status-codes'
import { ILoginInputModel } from '../../../src/features/auth/models/loginInput.model'
import { userManagerTest } from '../users/userManager.test'
import { IUserInputModel } from '../../../src/features/users/models/userInput.model'
import {PATH} from "../../../src/common/config/path";

export const authManagerTest = {
	/**
	 * 'login': 'alexx123',
	 * 'password': '123456',
	 * 'email': 'asdasdas@e.com'
	 */
	//todo стоит переписать без зависимости от api (сразу работа с базой)
	async createAndAuthUser(loginData: 'default' | ILoginInputModel | null = 'default', newUserData: 'default' | IUserInputModel = 'default',
													expectedStatus: StatusCodes = StatusCodes.OK, userAgent: string = ''
	): Promise<{ refreshToken: string, accessToken: string } | undefined> {

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
					.post(`${PATH.AUTH}/login`)
					.set('User-Agent', userAgent)
					.send(loginData)
					.expect(expectedStatus)
				break
			}

			case null: {
				res = await agent(app)
					.post(`${PATH.AUTH}/login`)
					.set('User-Agent', userAgent)
					.expect(expectedStatus)
				break
			}

			default: {
				res = await agent(app)
					.post(`${PATH.AUTH}/login`)
					.set('User-Agent', userAgent)
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
				.get(`${PATH.AUTH}/me`)
				.set({ authorization: `Bearer ${res.body.accessToken}`})


			expect(getUserByToken.body).toEqual({
				'email': newUserData.email,
				'login': newUserData.login,
				'userId': expect.any(String)
			})
			return {
				refreshToken: res.header['set-cookie'][0].split('; ')[0].replace('refreshToken=', ''),
				accessToken: res.body.accessToken
			}
		} else {
			return undefined
		}
	},

	async authUser(loginData: 'default' | ILoginInputModel = 'default',
								 expectedStatus: StatusCodes = StatusCodes.OK, userAgent: string = ''
	): Promise<{ accessToken: string, refreshToken: string } | undefined> {

		let res
		if (loginData === 'default') {
			loginData = {
				'loginOrEmail': 'alexx123',
				'password': '123456'
			}
			res = await agent(app)
				.post(`${PATH.AUTH}/login`)
				.set('User-Agent', userAgent)
				.send(loginData)
				.expect(expectedStatus)
		} else {
			res = await agent(app)
				.post(`${PATH.AUTH}/login`)
				.set('User-Agent', userAgent)
				.send(loginData)
				.expect(expectedStatus)
		}

		if (expectedStatus === StatusCodes.OK) {
			expect(res.body).toEqual(
				{
					'accessToken': res.body.accessToken
				}
			)
			const refreshToken  = res.header['set-cookie'][0].split('; ')[0].replace('refreshToken=', '')
			return {accessToken: res.body.accessToken, refreshToken}
		} else {
			return undefined
		}
	}
}
