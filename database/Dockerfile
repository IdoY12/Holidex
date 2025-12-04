FROM mysql:latest

COPY ./sunnydb.sql /docker-entrypoint-initdb.d/

# docker run --name sunnydb-db -d -e MYSQL_ALLOW_EMPTY_PASSWORD=1 -e MYSQL_DATABASE=sunnydb -e MYSQL_TCP_PORT=3306 -p 3308:3306 idoyahav/sunnydb-db:1.0.0