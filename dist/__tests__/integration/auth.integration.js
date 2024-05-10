"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = require("../../src/db/db");
const login_service_1 = require("../../src/service/login.service");
const email_service_1 = require("../../src/common/adapters/email.service");
const resultStatus_type_1 = require("../../src/common/types/resultStatus.type");
const userManager_test_1 = require("../e2e/users/userManager.test");
describe('Integration Auth', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        email_service_1.emailService.sendConfirmationCode = jest.fn().mockImplementation((email, subject, confirmationCode) => {
            return true;
        });
    }));
    it('should register user (add in db with confirmation code', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'qwerty',
            email: 'alewka24@gmail.com',
            password: 'qwerty1234@'
        };
        const result = yield login_service_1.loginService.registrationUser(data);
        expect(result).toEqual({
            status: resultStatus_type_1.ResultStatus.Success,
            data: null
        });
        const dbUser = db_1.db.getCollection().usersCollection.find({ login: data.login, email: data.email });
        expect(dbUser).toBeDefined();
        expect(email_service_1.emailService.sendConfirmationCode).toHaveBeenCalled();
        expect(email_service_1.emailService.sendConfirmationCode).toHaveBeenCalledTimes(1);
    }));
    it('should confirm user with correct code', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userManager_test_1.userManagerTest.createUsers(1);
        yield login_service_1.loginService.confirmationCode('abcd');
        const user = yield db_1.db.getCollection().usersCollection.find().toArray();
        expect(user[0].isConfirmed).toBe(true);
    }));
    it('should resend confirmation code', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userManager_test_1.userManagerTest.createUsers(1);
        const user = yield db_1.db.getCollection().usersCollection.find().toArray();
        yield login_service_1.loginService.resendConfirmationCode(user[0].email);
        const userUpdated = yield db_1.db.getCollection().usersCollection.find().toArray();
        expect(email_service_1.emailService.sendConfirmationCode).toHaveBeenCalled();
        expect(email_service_1.emailService.sendConfirmationCode).toHaveBeenCalledTimes(1);
        expect(userUpdated[0].isConfirmed = true);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
});
