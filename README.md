## to run this app in local:
### docker network create mongodb
### docker run -d --network mongodb --name mongo -p 27017:27017 mongo

### docker run -d --name server --network mongodb -p 3000:3000 volk22kaimn/basic-to-do-server:1.0.0
### docker run -d --name server --network mongodb -p 3000:3000 volk22kaimn/basic-to-do-server:1.0.0