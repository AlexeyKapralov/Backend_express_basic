import { runDb } from './db/db'

const express = require('express')
export const app = express()

async function runApp() {
	await runDb()
	app.listen(5000, () => {
		console.log('Example app listening on port http://localhost:5000!')
	})
}

runApp()
