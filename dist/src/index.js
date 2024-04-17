"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const setttings_1 = require("./setttings");
app_1.app.listen(setttings_1.SETTINGS.port, () => {
    console.log(`Server is running on port http://localhost:${setttings_1.SETTINGS.port}`);
});
