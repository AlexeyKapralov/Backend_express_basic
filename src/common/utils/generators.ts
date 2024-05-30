import {Response} from "express";
import {addSeconds} from "date-fns";
import {SETTINGS} from "../config/settings";

export const getRandomTitle = () => {
	const titles = ['Travel', 'Food', 'Car', 'Animals', 'Love', 'Philosophy', 'Psychology', 'Music', 'Movies', 'Experimental']
	const randomIndex = Math.floor(Math.random() * titles.length)
	return titles[randomIndex]
}

export const setCookie = (response: Response, rt: string) => {
	response.cookie(
		'refreshToken',
		rt,
		{
			httpOnly: true,
			secure: true,
			expires:
				addSeconds(
					new Date(),
					Number(SETTINGS.EXPIRATION.REFRESH_TOKEN.replace('s', ''))
				)
		}
	)
}