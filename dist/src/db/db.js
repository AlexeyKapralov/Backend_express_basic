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
exports.db = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../common/config/settings");
exports.db = {
    client: {},
    getDbName() {
        return this.client.db(settings_1.SETTINGS.DB_NAME);
    },
    run(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = new mongodb_1.MongoClient(url);
                yield this.client.connect();
                yield this.getDbName().command({ ping: 1 });
                console.log('Connected successfully to mongo server');
            }
            catch (e) {
                console.log('!!! Cannot connect to db', e);
                yield this.client.close();
            }
        });
    },
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Connection successfully closed');
            yield this.client.close();
        });
    },
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collections = yield this.getDbName().listCollections().toArray();
                for (const collection of collections) {
                    yield this.getDbName().collection(collection.name).deleteMany({});
                }
            }
            catch (error) {
                console.log('Error in drop db', error);
                yield this.stop();
            }
        });
    },
    getCollection() {
        return {
            usersCollection: this.getDbName().collection('users'),
            blogsCollection: this.getDbName().collection('blogs'),
            postsCollection: this.getDbName().collection('posts'),
            commentsCollection: this.getDbName().collection('comments'),
            blockListCollection: this.getDbName().collection('blockList')
        };
    }
};
