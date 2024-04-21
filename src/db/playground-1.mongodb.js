// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('social_dev')

// Create a new document in the collection.
// db.getCollection('blogs').insertOne({
// 	// "id": "string",
// 	name: 'TESTEEEEEEEE',
// 	description: 'string',
// 	websiteUrl: 'string',
// 	createdAt: '2024-04-19T16:31:20.442Z',
// 	isMembership: true
// })

// find a document in the collection.
// db.getCollection('blogs').find({})

// find a document in the collection.
// db.getCollection('blogs').findOne({
// 	_id: '662352de305b4c0fa9e03b3b'
// })

// update a document in the collection.
db.getCollection('blogs').updateOne(
	{
		_id: '66235cf818e649ece7dd76ab'
	},
	{
		$set: {
			name: 'secondString222',
			description: 'description2222'
		}
	}
)

// db.getCollection('blogs').deleteOne({
// 	name: 'TESTEEEEEEEE'
// })
