"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = require("../config/settings");
exports.emailService = {
    sendConfirmationCode(email, subject, html) {
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
        transport.sendMail({
            from: `"Alexey" <${settings_1.SETTINGS.LOGIN_MAIL}>`,
            to: email,
            subject,
            html,
        }).then(console.info).catch(console.error);
    }
};
