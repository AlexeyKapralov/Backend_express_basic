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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../common/config/settings");
exports.db = {
    run(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbName = settings_1.SETTINGS.DB_NAME;
            const mongoURI = `${url}/${dbName}`;
            try {
                yield mongoose_1.default.connect(mongoURI);
                console.log('it is ok');
            }
            catch (e) {
                console.log('no connection');
                yield mongoose_1.default.disconnect();
            }
        });
    },
    // getDbName(): Db {
    //     return this.client.db(SETTINGS.DB_NAME)
    // },
    //
    // async run(url: string) {
    //     try {
    //         this.client = new MongoClient(url)
    //         await this.client.connect()
    //         await this.getDbName().command({ping: 1})
    //         console.log('Connected successfully to mongo server')
    //     } catch (e) {
    //         console.log('!!! Cannot connect to db', e)
    //         await this.client.close()
    //     }
    // },
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
            console.log('Connection successfully closed');
        });
    },
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connection.dropDatabase();
            }
            catch (error) {
                console.log('Error in drop db', error);
                yield this.stop();
            }
        });
    }
    // ,
    // getCollection() {
    //     return {
    // usersCollection: this.getDbName().collection<IUserDbModel>('users'),
    // blogsCollection: this.getDbName().collection<IBlogDbModel>('blogs'),
    // postsCollection: this.getDbName().collection<IPostDbModel>('posts'),
    // commentsCollection: this.getDbName().collection<ICommentDbModel>('comments'),
    // rateLimitCollection: this.getDbName().collection<IRateLimit>('rateLimit'),
    // devices: this.getDbName().collection<IDeviceModel>('devices')
    //     }
    // }
};
