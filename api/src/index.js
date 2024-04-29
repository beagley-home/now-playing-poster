const express = require('express');
const fs = require('fs');
const path = require('path');
const { exitCode } = require('process');
const { parseString, parseStringPromise } = require('xml2js');
const cors = require('cors');

const app = express();

const PORT = 80;
const DIRECTORY = process.env.DIRECTORY; 
const EXCLUDE_LIST = process.env.EXCLUDE_LIST || "";
const RECENTLY_ADDED_WEIGHT = process.env.RECENTLY_ADDED_WEIGHT || 10;
const RECENTLY_RELEASED_WEIGHT = process.env.RECENTLY_RELEASED_WEIGHT || 5;
const YEARS_TO_CONSIDER_NEWLY_RELEASED  = process.env.YEARS_TO_CONSIDER_NEWLY_RELEASED || 2;

app.use(express.json());

let posters = []

async function getPosters(directory) {
	try {
		let movies = fs.readdirSync(directory)
		let currentTime = Date.now()
		let currentYear = new Date().getFullYear();

		for (const movie of movies) {
			let moviePath = path.join(directory, movie)

			let stats = fs.statSync(moviePath)

			if(stats.isDirectory()) {
				let posterPath = path.join(moviePath, 'poster.jpg');
				let exclusion = EXCLUDE_LIST.split(",").indexOf(movie)
				let year = /\((.*?)\)/.exec(movie)

				try {
					if(exclusion === -1) {
						fs.accessSync(posterPath, fs.constants.F_OK)

						let m = {
							"title": movie,
							"image": posterPath,
							"added": stats.ctimeMs,
							"released": year[1],
							"score": 1,
							"recently_added": false,
							"recently_released": false
						}

						// rank movie
						let timeSinceAdded = currentTime - m.added
						let releasedYear = parseInt(m.released)

						// Increase score if recently added (less than 30 days)
						if (timeSinceAdded < 30 * 24 * 60 * 60 * 1000) {
							m.score += parseInt(RECENTLY_ADDED_WEIGHT);
							m.recently_added = true
						}

						// Increase score if recently released 
						if (currentYear - releasedYear < YEARS_TO_CONSIDER_NEWLY_RELEASED) {
							m.score += parseInt(RECENTLY_RELEASED_WEIGHT);
							m.recently_released = true
						}

						posters.push(m)
					}

				} catch(err) {
					console.log(err)

				}

			}

		}

	} catch(err) {
		console.log(err)
	}

}

app.use(cors());

app.get('/api/posters', async (req, res) => {
	//reset movie object to empty for processing
	posters = []

	await getPosters(DIRECTORY)

	res.json(posters)
});

app.get('/api/poster/:movieName', async (req, res) => {
	const movieName = req.params.movieName;

	let imagePath = path.join(DIRECTORY, "/", movieName, "/poster.jpg")
	res.sendFile(imagePath);
});

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});