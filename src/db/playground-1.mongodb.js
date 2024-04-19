// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('social_dev')

// Create a new document in the collection.
db.getCollection('blogs').insertOne({
	// "id": "string",
	name: 'TESTEEEEEEEE',
	description: 'string',
	websiteUrl: 'string',
	createdAt: '2024-04-19T16:31:20.442Z',
	isMembership: true
})

// db.getCollection('blogs').deleteOne({
// 	name: 'TESTEEEEEEEE'
// })
