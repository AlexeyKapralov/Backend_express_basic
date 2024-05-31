import {agent} from 'supertest'
import {IUserInputModel} from '../../../src/features/users/models/userInput.model'
import {SETTINGS} from '../../../src/common/config/settings'
import {app} from '../../../src/app'
import {StatusCodes} from 'http-status-codes'
import {db} from "../../../src/db/db";
import {ObjectId} from "mongodb";
import { add } from 'date-fns'
import { IUserViewModel } from '../../../src/features/users/models/userView.model'
import {PATH} from "../../../src/common/config/path";

const getRandomName = () => {
    const names = ["John", "Alice", "Bob", "Eva", "Michael", "Emma", "David", "Sophia", "James", "Olivia"];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

export const userManagerTest = {

    /**
     * login: 'login' password: 'qwert1234' email: 'asdf@mail.ru'
     *
     * **/
    async createUser(
        data: IUserInputModel | 'default' = 'default',
        auth: string = '',
        expected_status: number = StatusCodes.CREATED
    ): Promise<IUserViewModel> {
        if (data === 'default') {
            data = {
                login: 'login',
                password: 'qwert1234',
                email: 'as@mail.ru'
            }
        }
        const buff = Buffer.from(auth, 'utf-8')
        const decodedAuth = buff.toString('base64')
        const result = await agent(app)
            .post(PATH.USERS)
            .send(data)
            .set({authorization: `Basic ${decodedAuth}`})

        expect(result.status).toBe(expected_status)

        if (result.status === StatusCodes.CREATED) {
            expect(result.body).toEqual({
                login: data.login,
                email: data.email,
                createdAt: expect.any(String),
                id: expect.any(String)
            })
        }
        return result.body
    },


    async createUsers(count: number) {
        // let users = [];
        for (let i = 0; i < count; i++) {
            let user: IUserDtoModel = {
                _id: new ObjectId().toString(),
                login: getRandomName() + i, // Добавляем к имени номер
                email: `generatedEmail${i}@example.com`,
                createdAt: new Date().toISOString(),
                password: `generatedPassword${i}`,
                isConfirmed: false,
                confirmationCodeExpired: add(new Date(), {hours:1}),
                confirmationCode: 'abcd'
            };
            // users.push(user);
            // users = [...users, user];

            await UserModel.create(user)
        }
    },

    async deleteUser(
        id: string,
        auth: string = '',
        expected_status: number = StatusCodes.NO_CONTENT
    ) {
        const buff = Buffer.from(auth, 'utf-8')
        const decodedAuth = buff.toString('base64')
        const result = await agent(app)
            .delete(`${PATH.USERS}/${id}`)
            .set({authorization: `Basic ${decodedAuth}`})

        expect(result.status).toBe(expected_status)

        if (result.status === StatusCodes.NO_CONTENT) {
            const res = await UserModel.findOne({_id: id})
            expect(res).toBe(null)
        }
    },

    customSort(array: any, key: any, type = 'string', order: 'asc' | 'desc' = 'asc') {
        return array.sort((a: any, b: any) => {
            const valueA = (type === 'string') ? a[key].toLowerCase() : a[key];
            const valueB = (type === 'string') ? b[key].toLowerCase() : b[key];

            if (valueA < valueB) {
                return (order === 'asc') ? -1 : 1;
            }
            if (valueA > valueB) {
                return (order === 'asc') ? 1 : -1;
            }
            return 0;
        });
    }

}
