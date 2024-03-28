import express, {Request, Response} from 'express'

export const app = express()
app.use(express.json())

const products = [{title: 'tomato'}, {title: 'orange'}]
const addresses = [{id: 1, value: 'abasdasd'}, {id: 2, value: 'rewq'}]

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({version: '1.0'})
})

app.get('/products', (req: Request, res: Response) => {
    if (req.query.title) {
        let searchString = req.query.title.toString()
        res.send(products.filter( p => p.title.indexOf(searchString) > -1))
    }
    res.send(products)
})

app.get('/addresses', (req: Request, res: Response) => {
    if (req.query.title) {
        let searchString = req.query.title.toString()
        res.send(products.filter( p => p.title.indexOf(searchString) > -1))
    }
    res.send(addresses)
})

app.get('/addresses/:id', (req: Request, res: Response) => {
    let address = addresses.find( p => p.id === +req.params.id)
    if (address) {
        res.send(address)
    } else {
        res.send(404)
    }

})

app.delete('/addresses/:id', (req: Request, res: Response) => {

    for (let i=0; i < addresses.length; i++){
        if (addresses[i].id === +req.params.id) {
            addresses.splice(i, 1)
            res.send(204)
            return
        }
    }

    res.send(404)

})

app.post('/addresses', (req: Request, res: Response) => {
    const newAddr = {
        id: +(new Date()),
        value: req.body.title
    }
    addresses.push(newAddr)

    res.status(201).send(newAddr)

})