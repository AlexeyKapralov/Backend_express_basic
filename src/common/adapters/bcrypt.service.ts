import bcrypt from 'bcrypt'
import {injectable} from "inversify";

@injectable()
export class BcryptService {
    async createPasswordHash(password: string, salt?: string) {
        if (salt === undefined) {
            salt = bcrypt.genSaltSync(10)
        }
        return await bcrypt.hash(password, salt)
    }

    async comparePasswordsHash(reqPassPlainText: string, dbPassHash: string) {
        return await bcrypt.compare(reqPassPlainText, dbPassHash)
    }
}
