"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const products = [{ title: 'tomato' }, { title: 'orange' }];
const addresses = [{ id: 1, value: 'abasdasd' }, { id: 2, value: 'rewq' }];
exports.app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' });
});
exports.app.get('/products', (req, res) => {
    if (req.query.title) {
        let searchString = req.query.title.toString();
        res.send(products.filter(p => p.title.indexOf(searchString) > -1));
    }
    res.send(products);
});
exports.app.get('/addresses', (req, res) => {
    if (req.query.title) {
        let searchString = req.query.title.toString();
        res.send(products.filter(p => p.title.indexOf(searchString) > -1));
    }
    res.send(addresses);
});
exports.app.get('/addresses/:id', (req, res) => {
    let address = addresses.find(p => p.id === +req.params.id);
    if (address) {
        res.send(address);
    }
    else {
        res.send(404);
    }
});
exports.app.delete('/addresses/:id', (req, res) => {
    for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].id === +req.params.id) {
            addresses.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
exports.app.post('/addresses', (req, res) => {
    const newAddr = {
        id: +(new Date()),
        value: req.body.title
    };
    addresses.push(newAddr);
    res.status(201).send(newAddr);
});
