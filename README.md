## Installation

### Install with DockerHub

1. If you want to install on DockerHub, just type this command.
   ```sh
    docker run --name ms-razi-betest -d -p 3000:3000 razizs/ms-razi-betest:latest
   ```
2. import crud-api.json to postman and test on postman http://localhost:3000

### Manuel Installation
1. Clone the repo
   ```sh
    git clone https://github.com/razidev/razi-betest.git
   ```
2. Build docker image
   ```sh
    docker build -t razizs/ms-razi-betest .
   ```
3. Run container
   ```sh
    docker run -p 3000:3000  razizs/ms-razi-betest:latest
   ```
4. import crud-api.json to postman and test on postman http://localhost:3000
