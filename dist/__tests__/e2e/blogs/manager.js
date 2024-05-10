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
exports.blogsManagerTest = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../src/db/db");
exports.blogsManagerTest = {
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === 'default') {
                data = {
                    'name': 'string',
                    'description': 'string',
                    'websiteUrl': 'https://8aD.ru'
                };
            }
            const newBlog = {
                _id: new mongodb_1.ObjectId().toString(),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: true
            };
            yield db_1.db.getCollection().blogsCollection.insertOne(newBlog);
        });
    }
};
