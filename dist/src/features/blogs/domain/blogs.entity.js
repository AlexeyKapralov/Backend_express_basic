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
exports.BlogModel = exports.BlogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
exports.BlogSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: {
        type: String,
        required: true,
        match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
    }
});
exports.BlogSchema.static('getBlogByID', function getBlogByID(id) {
    return this.findOne({
        _id: id
    });
});
exports.BlogSchema.static('initUser', function initUser(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const blog = {
            _id: new mongodb_1.ObjectId().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return yield this.create(blog);
    });
});
exports.BlogModel = mongoose_1.default.model('blogs', exports.BlogSchema);
