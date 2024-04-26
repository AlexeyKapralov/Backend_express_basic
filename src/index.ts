import { db } from './db/db'
import { SETTINGS } from './common/config/settings'
import { app } from './app'

async function runApp() {
	await db.run(SETTINGS.MONGO_URL)
	app.listen(SETTINGS.PORT, () => {
		console.log('Example app listening on port http://localhost:5000')
	})
}

runApp()
