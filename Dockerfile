FROM ubuntu:latest
LABEL authors="jangsen"

ENTRYPOINT ["top", "-b"]