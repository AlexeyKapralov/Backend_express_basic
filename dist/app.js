"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
_1.app.get("/", (req, res) => {
    res.send("Hello World!");
});
