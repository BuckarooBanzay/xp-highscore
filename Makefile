
TAG=registry.rudin.io/x86/minetest-xp-highscore

build:
	docker build . -t $(TAG)

push:
	docker push $(TAG)
