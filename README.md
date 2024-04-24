### running in live production location

1. Setup `.env` file in this repos root

	Example

	```
	FRONTEND_PORT=80
	API_PORT=8080
	DIRECTORY=/mnt/the_hive/media/Movies
	EXCLUDE_LIST=".deletedByTMM,test"
	VUE_APP_API_HOST=http://localhost:8080
	```

2. Build Containers

	```shell
	docker compose --build
	````


### Running the setup
You can either run the setup using docker-compose and run on a single machine, or you can run the API separately if you have
existing compute that you can leverage. In this case, I run the API from one of my homelab servers so its always up and mounted
to appropriate directory. That way the TV just needs to run the frontend and doesn't need to worry about mount not existing
at startup. 

Run with docker-compose

```shell
docker-compose up
```

Run separately. Examples are using Docker, but adapt appropriately to your orchestration platform of choice

API
```shell
docker run -d \
	-p 8080:80 \
	-v /mnt/the_hive/media/Movies:/mnt/the_hive/media/Movies \
	--env-file ./.env \
	coming-soon-poster-api
```	

Frontend
```shell
docker run -d \
	-p 80:80 \
	--env-file ./.env \
	coming-soon-poster-frontend
```	
