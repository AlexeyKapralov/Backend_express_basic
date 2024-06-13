"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = require("../config/settings");
const inversify_1 = require("inversify");
let EmailService = class EmailService {
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
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, inversify_1.injectable)()
], EmailService);
