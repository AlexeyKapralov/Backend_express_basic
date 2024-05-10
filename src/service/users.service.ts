import {bcryptService} from '../common/adapters/bcrypt.service'
import {IUserInputModel} from '../features/users/models/userInput.model'
import {IUserViewModel} from '../features/users/models/userView.model'
import {usersRepository} from '../repositories/users/users.repository'
import { getUserViewModel } from '../common/utils/mappers'

//TODO: переписать всё на новый тип Result Type
export const usersService = {
    async createUser(
        data: IUserInputModel
    ): Promise<IUserViewModel | undefined> {
        const passwordHash = await bcryptService.createPasswordHash(data.password)
        const user =  await usersRepository.createUser(data, passwordHash, 'admin')
        return user ? getUserViewModel(user) : undefined
    },
    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    }
}
