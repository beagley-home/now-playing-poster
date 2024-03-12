const express = require('express');
const fs = require('fs');
const path = require('path');
const { exitCode } = require('process');
const { parseString, parseStringPromise } = require('xml2js');

const app = express();

const PORT = process.env.PORT || 3000;
const DIRECTORY = process.env.DIRECTORY; 
const EXCLUDE_LIST = process.env.EXCLUDE_LIST || "";

app.use(express.json());

let posters = []

async function getPosters(directory) {
	try {
		let movies = fs.readdirSync(directory)

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
							"added": stats.mtime,
							"released": year[1]
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

app.get('/api/posters', async (req, res) => {
	//reset movie object to empty for processing
	posters = []

	await getPosters(DIRECTORY)

	res.json(posters)
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});