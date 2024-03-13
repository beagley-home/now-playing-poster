### running in live production location


	docker build . -t coming-soon

	docker run -d \
		-p 8080:8080 \
		-v /mnt/the_hive/media/Movies:/mnt/the_hive/media/Movies \
		--env-file ./.env \
		coming-soon