import nodemailer from 'nodemailer'
import { SETTINGS } from '../config/settings'

export const emailService = {
	sendConfirmationCode (email: string, subject: string, html: string) {
		let transport = nodemailer.createTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: SETTINGS.LOGIN_MAIL,
					pass: SETTINGS.PASS_MAIL
				}
			}
		)

		transport.sendMail({
			from: `"Alexey" <${SETTINGS.LOGIN_MAIL}>`,
			to: email,
			subject,
			html,
		}).then(console.info).catch(console.error)
	}
}
