sudo docker-compose stop

# sudo docker volume rm services_amqp-data
sudo rm -rf rm .docker

sudo docker-compose up --build --force-recreate discord events rabbitmq