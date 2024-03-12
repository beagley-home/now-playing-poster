<template>
	<div class="hello">
		<h1>Now Playing</h1>
		<img :src="poster_url" alt="Current Poster">
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
				const response = await fetch('/api/posters'); // Replace this URL with your API endpoint
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
			if (this.posters_to_display.length > 0) {
				let rand = Math.floor(Math.random() * this.posters_to_display.length);

				let movie = this.posters_to_display[rand]

				return movie

			} else {
				console.error('no images found')
			}

		}
	},
	watch: {
		current_movie: function (movie) {
			this.poster_url = `/api/poster/${movie.title}`

		}

	},
	computed: {
		top_released: function () {
			if (this.posters.length > 0) {
				let temp = this.posters
				let sorted = temp.sort((a, b) => {
					return parseInt(b.released) - parseInt(a.released);

				})

				return sorted.slice(0, this.number_of_items)
			} else {
				return []

			}

		},
		top_added: function () {
			if (this.posters.length > 0) {
				let temp = this.posters
				let sorted = temp.sort((a, b) => {
					return b.added - a.added;

				})

				return sorted.slice(0, this.number_of_items)
			} else {
				return []

			}

		},
		posters_to_display: function () {
			if (this.top_released.length > 0 || this.top_added.length > 0) {
				return this.top_added.concat(this.top_released)
			} else {
				return []

			}

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
		}, actual_this.rotate_movie_seconds); // 30 seconds in milliseconds

		// get new movies
		this.interval = setInterval(async () => {
			await actual_this.fetchData()
		}, actual_this.get_new_movies_seconds); // 30 seconds in milliseconds

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>
