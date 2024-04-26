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
const db_1 = require("./db/db");
const settings_1 = require("./common/config/settings");
const app_1 = require("./app");
function runApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.db.run(settings_1.SETTINGS.MONGO_URL);
        app_1.app.listen(settings_1.SETTINGS.PORT, () => {
            console.log('Example app listening on port http://localhost:5000');
        });
    });
}
runApp();
