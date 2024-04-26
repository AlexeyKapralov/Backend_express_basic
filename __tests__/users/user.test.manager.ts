import { agent } from 'supertest'
import { IUserInputModel } from '../../src/features/users/models/user.input.model'
import { SETTINGS } from '../../src/common/config/settings'
import { app } from '../../src/app'
import { StatusCodes } from 'http-status-codes'
import { bcryptService } from '../../src/common/adapters/bcrypt.service'
import { IUserViewModel } from '../../src/features/users/models/user.view.model'

export const userTestManager = {
	async createUser(
		data: IUserInputModel,
		auth: string = '',
		expected_status: number = StatusCodes.CREATED
	) {
		const buff = Buffer.from(auth, 'utf-8')
		const decodedAuth = buff.toString('base64')
		const result = await agent(app)
			.post(SETTINGS.PATH.USERS)
			.send(data)
			.set({ authorization: `Basic ${decodedAuth}` })

		expect(result.status).toBe(expected_status)

		if (result.status === StatusCodes.CREATED) {
			expect(result.body).toEqual({
				login: data.login,
				password: expect.any(String),
				email: data.email,
				createdAt: expect.any(String),
				id: expect.any(String)
			})

			const salt = result.body.password.slice(0, 29)

			const passHash = await bcryptService.createPasswordHash(
				data.password,
				salt
			)
			const createdPassHash = await bcryptService.createPasswordHash(
				result.body.password
			)
			const isTruePass = await bcryptService.comparePasswordsHash(
				passHash,
				createdPassHash
			)
			expect(isTruePass).toBe(true)
		}
	}
}
