DOCKER := $(shell which docker)
DOCKER_TAG := arablocks/ann-dns

docker: Dockerfile
	$(DOCKER) build -t $(DOCKER_TAG) .

