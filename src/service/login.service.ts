import { bcryptService } from '../common/adapters/bcrypt.service'
import { usersRepository } from '../repositories/users/users.repository'
import { ILoginInputModel } from '../features/auth/models/loginInput.model'
import { ResultType } from '../common/types/result.type'
import { ResultStatus } from '../common/types/resultStatus.type'
import { IUserInputModel } from '../features/users/models/userInput.model'
import { emailService } from '../common/adapters/email.service'

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

		const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
						 <a href='https://ab.com?code=${user!.confirmationCode}'>complete registration</a>
				 </p>
			`
		try {
			emailService.sendConfirmationCode(user!.email, 'Confirmation code', html)
		} catch (e) {
			console.error(`some problems with send confirm code ${e}`)
		}

		return {
			status: ResultStatus.Success,
			data: null
		}
	},
	async loginUser(data: ILoginInputModel): Promise<ResultType> {
		const user = await usersRepository.findUserWithPass(data.loginOrEmail)

		if (!user) {
			return {
				data: null,
				status: ResultStatus.NotFound
			}
		} else {
			const isTrueHash = await bcryptService.comparePasswordsHash(data.password, user.password)
			return {
				status: isTrueHash ? ResultStatus.Success : ResultStatus.BadRequest,
				data: null
			}
		}
	}
}
