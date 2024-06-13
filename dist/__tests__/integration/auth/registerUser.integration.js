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
const db_1 = require("../../../src/db/db");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
const user_entity_1 = require("../../../src/features/users/domain/user.entity");
const ioc_1 = require("../../../src/ioc");
const email_service_1 = require("../../../src/common/adapters/email.service");
const auth_service_1 = require("../../../src/features/auth/service/auth.service");
describe('Integration Auth', () => {
    const emailService = ioc_1.container.resolve(email_service_1.EmailService);
    const authService = ioc_1.container.resolve(auth_service_1.AuthService);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        emailService.sendConfirmationCode = jest.fn().mockImplementation((email, subject, confirmationCode) => {
            return true;
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
    it('should create tokens', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'qwerty',
            email: 'alewka24@gmail.com',
            password: 'qwerty1234@'
        };
        const result = yield authService.registrationUser(data);
        expect(result).toEqual({
            status: resultStatus_type_1.ResultStatus.Success,
            data: null
        });
        const dbUser = user_entity_1.UsersModel.find({ login: data.login, email: data.email });
        expect(dbUser).toBeDefined();
        expect(emailService.sendConfirmationCode).toHaveBeenCalled();
        expect(emailService.sendConfirmationCode).toHaveBeenCalledTimes(1);
    }));
});
