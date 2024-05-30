"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = exports.getRandomTitle = void 0;
const date_fns_1 = require("date-fns");
const settings_1 = require("../config/settings");
const getRandomTitle = () => {
    const titles = ['Travel', 'Food', 'Car', 'Animals', 'Love', 'Philosophy', 'Psychology', 'Music', 'Movies', 'Experimental'];
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
};
exports.getRandomTitle = getRandomTitle;
const setCookie = (response, rt) => {
    response.cookie('refreshToken', rt, {
        httpOnly: true,
        secure: true,
        expires: (0, date_fns_1.addSeconds)(new Date(), Number(settings_1.SETTINGS.EXPIRATION.REFRESH_TOKEN.replace('s', '')))
    });
};
exports.setCookie = setCookie;
