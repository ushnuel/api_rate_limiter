# API Rate Limiter

A rate limiter puts a limit to a number of requests a service can fulfil, and throttles the requests that cross the predefined limit.

## Installation

To install the project,

- Clone the repository by running the command `git clone https://github.com/ushnuel/api_rate_limiter.git` on your terminal
- Install the project by running `npm install`

This project uses Redis, an open source, in-memory data structure store, as a cache

To install Redis, we will use Docker, a platform that allows you to run applications using containers.

### Download and install Docker Desktop

You can download and install Docker Desktop from the following links:

- For Windows: https://docs.docker.com/desktop/windows/install/
- For Mac: https://docs.docker.com/desktop/mac/install/

Follow the instructions on the website to complete the installation.

### Pull and run the Redis image

Once you have Docker Desktop installed, you can pull and run the Redis image using the following commands:

- To pull the Redis image from Docker Hub: `docker pull redis`
- To run the Redis image in a container: `docker run --name my-redis-container -p 6379:6379 -d redis`

This will create a container named `my-redis-container` that runs the Redis image and exposes port 6379 for communication.

## Testing

`Jest` is used for the unit testing. To test, run the command `npm run test`

For manual testing, start the server by running `npm run dev`. Open your web browser and navigate to `http://localhost:8000/api`.
You can manually adjust the adjust the default limits set in the `/rulesDB`
