"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomTitle = void 0;
const getRandomTitle = () => {
    const titles = ['Travel', 'Food', 'Car', 'Animals', 'Love', 'Philosophy', 'Psychology', 'Music', 'Movies', 'Experimental'];
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
};
exports.getRandomTitle = getRandomTitle;
