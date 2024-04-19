import { app } from './app'
import { SETTINGS } from './settings'
import { runDb } from './db/db'

const startApp = async () => {
	await runDb()
	app.listen(SETTINGS.PORT, () => {
		console.log(`Server is running on port http://localhost:${SETTINGS.PORT}`)
	})
}

startApp()
