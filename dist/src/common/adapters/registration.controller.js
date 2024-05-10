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
exports.registrationController = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = require("../../../common/config/settings");
const registrationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let transport = nodemailer_1.default.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: settings_1.SETTINGS.LOGIN_MAIL,
            pass: settings_1.SETTINGS.PASS_MAIL
        }
    });
    let info = yield transport.sendMail({
        from: 'Alexey',
        to: req.body.email,
        subject: req.body.subject,
        html: req.body.html
    }).then(console.info).catch(console.error);
    res.send({
        email: req.body.email
    });
});
exports.registrationController = registrationController;
