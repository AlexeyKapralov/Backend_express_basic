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
exports.runDb = exports.blogsCollection = exports.db = void 0;
const mongodb_1 = require("mongodb");
exports.db = {
    blogs: [
        { id: `id_blog1`, name: `name_blog1`, description: `string`, websiteUrl: `string` },
        { id: `id_blog2`, name: `name_blog2`, description: `string`, websiteUrl: `string` },
    ],
    posts: [
        {
            id: `id_post1`,
            title: `name_post1`,
            shortDescription: `string`,
            content: `string`,
            blogId: `string`,
            blogName: `string`
        },
        {
            id: `id_post2`,
            title: `name_post2`,
            shortDescription: `string`,
            content: `string`,
            blogId: `string`,
            blogName: `string`
        },
    ]
};
const mongo_url = process.env.MONGO_URL;
console.log(mongo_url);
if (!mongo_url) {
    throw new Error(`! Url didn't find`);
}
const client = new mongodb_1.MongoClient(mongo_url);
const db2 = client.db();
exports.blogsCollection = db2.collection('blogs');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log('Connected succesfully to mongo server');
        }
        catch (_a) {
            console.log(`!!! Can't connect to db`);
            yield client.close();
        }
    });
}
exports.runDb = runDb;
