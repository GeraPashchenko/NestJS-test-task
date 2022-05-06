## First Launch
 - create .env file and fill it like .env.example
 - npm run docker:start
 - docker-compose run nestjs npm run migration:run


## For local development

You need to run local instance of PostgreSQL
 - npm install
 - npm run migration:run
 - npm run start:dev


## Swagger Documentation
- Go to http://localhost:3000/api


## PgAdmin4
If you run docker instance:
 - http://localhost:8080
 - login with default credentials or change them in docker-compose file
