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
exports.runDb = exports.postsCollection = exports.blogsCollection = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
const mongo_url = settings_1.SETTINGS.MONGO_URL;
console.log(mongo_url);
if (!mongo_url) {
    throw new Error('!!! Url did not found');
}
const client = new mongodb_1.MongoClient(mongo_url);
const db = client.db();
exports.blogsCollection = db.collection('blogs');
exports.postsCollection = db.collection('posts');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Connected successfully to mongo server');
        }
        catch (_a) {
            console.log('!!! Cannot connect to db');
        }
    });
}
exports.runDb = runDb;
