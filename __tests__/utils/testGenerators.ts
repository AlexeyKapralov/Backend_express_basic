export const getRandomTitle = () => {
	const titles = ['Travel', 'Food', 'Car', 'Animals', 'Love', 'Philosophy', 'Psychology', 'Music', 'Movies', 'Experimental']
	const randomIndex = Math.floor(Math.random() * titles.length)
	return titles[randomIndex]
}