<template>
	<div>
		<img width="2160px" :src="poster_url" alt="Current Poster">
	</div>

</template>

<script>
export default {
	name: 'SlideShow',
	data() {
		return {
			posters: [], // Initialize slides array to hold data
			current_movie: null,
			poster_url: null,
			number_of_items: 5,
			rotate_movie_seconds: 30000, //in milliseconds
			get_new_movies_seconds: 900000, //in milliseconds every 15 minutes
		};
	},
	methods: {
		async fetchData() {
			try {
				const response = await fetch(`${process.env.VUE_APP_API_HOST}/api/posters`); // Replace this URL with your API endpoint
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				const data = await response.json();
				this.posters = data; // Populate slides array with fetched data

				return data;

			} catch (error) {
				console.error('Error fetching data:', error);

				this.posters = [];
				return [];
			}
		},
		async getRandomMovie() {
			if (this.posters.length > 0) {
				//get scores for each movie
				let scores = this.posters.map(movie => movie.score);

				//sum all ranks
				let totalScore = scores.reduce((a, b) => a + b, 0);

				console.log(totalScore);
				//get threshold of a random number between 0 and totalScore
				let threshold = Math.random() * totalScore;

				console.log(threshold);

				let cumulativeScore = 0;

				for (let i = 0; i < this.posters.length; i++) {
					cumulativeScore += scores[i];

					if(cumulativeScore >= threshold) {
						return this.posters[i]

					}

				}

				return null;

			} else {
				console.error('no images found')
			}

		}
	},
	watch: {
		current_movie: function (movie) {
			this.poster_url = `${process.env.VUE_APP_API_HOST}/api/poster/${movie.title}`

		}

	},
	mounted: async function () {
		let actual_this = this
		// Call fetchData method when the component is mounted
		await this.fetchData()

		this.current_movie = await this.getRandomMovie()

		// rotate movie every 30 seconds
		this.interval = setInterval(async () => {
			actual_this.current_movie = await actual_this.getRandomMovie()
		}, actual_this.rotate_movie_seconds);

		// get new movies
		this.interval = setInterval(async () => {
			await actual_this.fetchData()
		}, actual_this.get_new_movies_seconds);

	}
}
</script>
