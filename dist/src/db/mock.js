"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogReturn = exports.blogs = void 0;
const mongodb_1 = require("mongodb");
exports.blogs = [
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'firstString',
        description: 'description1',
        websiteUrl: 'url1',
        createdAt: '2024-04-19T08:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'secondString',
        description: 'description2',
        websiteUrl: 'url2',
        createdAt: '2024-04-19T10:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'thirdString',
        description: 'description3',
        websiteUrl: 'url3',
        createdAt: '2024-04-19T14:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'fourthString',
        description: 'description4',
        websiteUrl: 'url4',
        createdAt: '2024-04-19T16:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'fifthString',
        description: 'description5',
        websiteUrl: 'url5',
        createdAt: '2024-04-19T18:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'sixthString',
        description: 'description6',
        websiteUrl: 'url6',
        createdAt: '2024-04-19T20:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'seventhString',
        description: 'description7',
        websiteUrl: 'url7',
        createdAt: '2024-04-19T22:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'eighthString',
        description: 'description8',
        websiteUrl: 'url8',
        createdAt: '2024-04-20T00:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'ninthString',
        description: 'description9',
        websiteUrl: 'url9',
        createdAt: '2024-04-20T02:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'tenthString',
        description: 'description10',
        websiteUrl: 'url10',
        createdAt: '2024-04-20T04:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'eleventhString',
        description: 'description11',
        websiteUrl: 'url11',
        createdAt: '2024-04-20T06:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'twelfthString',
        description: 'description12',
        websiteUrl: 'url12',
        createdAt: '2024-04-20T08:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'thirteenthString',
        description: 'description13',
        websiteUrl: 'url13',
        createdAt: '2024-04-20T10:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'fourteenthString',
        description: 'description14',
        websiteUrl: 'url14',
        createdAt: '2024-04-20T12:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'fifteenthString',
        description: 'description15',
        websiteUrl: 'url15',
        createdAt: '2024-04-20T14:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'sixteenthString',
        description: 'description16',
        websiteUrl: 'url16',
        createdAt: '2024-04-20T16:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'seventeenthString',
        description: 'description17',
        websiteUrl: 'url17',
        createdAt: '2024-04-20T18:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'eighteenthString',
        description: 'description18',
        websiteUrl: 'url18',
        createdAt: '2024-04-20T20:00:00.000Z',
        isMembership: false
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'nineteenthString',
        description: 'description19',
        websiteUrl: 'url19',
        createdAt: '2024-04-20T22:00:00.000Z',
        isMembership: true
    },
    {
        _id: String(new mongodb_1.ObjectId()),
        name: 'twentiethString',
        description: 'description20',
        websiteUrl: 'url20',
        createdAt: '2024-04-21T00:00:00.000Z',
        isMembership: false
    }
];
exports.blogReturn = {
    pagesCount: 2,
    page: 1,
    pageSize: 10,
    totalCount: 20,
    items: [
        {
            id: '662224e953c844f8b3673719',
            name: 'twentiethString',
            description: 'description20',
            websiteUrl: 'url20',
            createdAt: '2024-04-21T00:00:00.000Z',
            isMembership: false
        },
        {
            id: '662224e953c844f8b3673718',
            name: 'nineteenthString',
            description: 'description19',
            websiteUrl: 'url19',
            createdAt: '2024-04-20T22:00:00.000Z',
            isMembership: true
        },
        {
            id: '662224e953c844f8b3673717',
            name: 'eighteenthString',
            description: 'description18',
            websiteUrl: 'url18',
            createdAt: '2024-04-20T20:00:00.000Z',
            isMembership: false
        },
        {
            id: '662224e953c844f8b3673716',
            name: 'seventeenthString',
            description: 'description17',
            websiteUrl: 'url17',
            createdAt: '2024-04-20T18:00:00.000Z',
            isMembership: true
        },
        {
            id: '662224e953c844f8b3673715',
            name: 'sixteenthString',
            description: 'description16',
            websiteUrl: 'url16',
            createdAt: '2024-04-20T16:00:00.000Z',
            isMembership: false
        },
        {
            id: '662224e953c844f8b3673714',
            name: 'fifteenthString',
            description: 'description15',
            websiteUrl: 'url15',
            createdAt: '2024-04-20T14:00:00.000Z',
            isMembership: true
        },
        {
            id: '662224e953c844f8b3673713',
            name: 'fourteenthString',
            description: 'description14',
            websiteUrl: 'url14',
            createdAt: '2024-04-20T12:00:00.000Z',
            isMembership: false
        },
        {
            id: '662224e953c844f8b3673712',
            name: 'thirteenthString',
            description: 'description13',
            websiteUrl: 'url13',
            createdAt: '2024-04-20T10:00:00.000Z',
            isMembership: true
        },
        {
            id: '662224e953c844f8b3673711',
            name: 'twelfthString',
            description: 'description12',
            websiteUrl: 'url12',
            createdAt: '2024-04-20T08:00:00.000Z',
            isMembership: false
        },
        {
            id: '662224e953c844f8b3673710',
            name: 'eleventhString',
            description: 'description11',
            websiteUrl: 'url11',
            createdAt: '2024-04-20T06:00:00.000Z',
            isMembership: true
        }
    ]
};
