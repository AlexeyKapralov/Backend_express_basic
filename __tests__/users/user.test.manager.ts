import {agent} from 'supertest'
import {IUserInputModel} from '../../src/features/users/models/userInput.model'
import {SETTINGS} from '../../src/common/config/settings'
import {app} from '../../src/app'
import {StatusCodes} from 'http-status-codes'
import {bcryptService} from '../../src/common/adapters/bcrypt.service'
import {db} from "../../src/db/db";
import {ObjectId} from "mongodb";

const getRandomName = () => {
	const names = ["John", "Alice", "Bob", "Eva", "Michael", "Emma", "David", "Sophia", "James", "Olivia"];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

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
            .set({authorization: `Basic ${decodedAuth}`})

        expect(result.status).toBe(expected_status)

        if (result.status === StatusCodes.CREATED) {
            expect(result.body).toEqual({
                login: data.login,
                password: expect.any(String),
                email: data.email,
                createdAt: expect.any(String),
                id: expect.any(String)
            })
            // TODO: почему в тестах при проверки соли мне требуется брать всё от 0 до 29 символа из хэша,
            //  хотя в документации написано с 7го символа
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
    },

    async createUsers(count:number) {
        // let users = [];
        for (let i = 0; i < count; i++) {
            let user = {
                _id: new ObjectId().toString(),
                login: getRandomName() + i, // Добавляем к имени номер
                email: `generatedEmail${i}@example.com`,
                createdAt: new Date().toISOString(),
                password: `generatedPassword${i}`
            };
            // users.push(user);
            // users = [...users, user];

            await db.getCollection().usersCollection.insertOne(user)
        }
    }

}
