import bcrypt from 'bcrypt'
import { BlockLike } from 'typescript'

export const bcryptService = {
	async createPasswordHash(password: string, salt?: string) {
		if (salt === undefined) {
			salt = bcrypt.genSaltSync(10)
		}
		return await bcrypt.hash(password, salt)
	},
	async comparePasswordsHash(reqPassHash: string, dbPassHash: string) {
		return await bcrypt.compare(reqPassHash, dbPassHash)
	}
}
