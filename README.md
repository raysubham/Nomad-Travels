<img src='https://www.subhamray.com/_next/image?url=%2F_next%2Fstatic%2Fimage%2Fcomponents%2Fassets%2Fnomad-travels.16511fe490c1eea362507d0cc27a0528.jpeg&w=1920&q=75' alt='nomad-travels' />

# Nomad Travels 🏠 🗺️

Come! Let's go places!

## Description

This Web App uses Typescript everywhere(both frontend & backend).

### Frontend Tech

- [reactjs](https://reactjs.org/) as the main UI library.
- [ant-design](https://ant.design/) as the CSS component library to create visually-appealing UI.
- [apollo-client](https://www.apollographql.com/) for fetching GraphQL query & mutating data from and to the server.

### Backend Tech

- [expressjs](https://expressjs.com/) framework on top of the [nodejs](https://nodejs.org/en/) runtime.
- [apollo-server](https://www.apollographql.com/) for serving data to the client.
- [mongodb-atlas](https://www.mongodb.com/cloud/atlas) for the database.It's free and awesome.
- [cloudinary](https://cloudinary.com/) for storing all the image files.
- [google-oauth-2.0](https://developers.google.com/identity/protocols/oauth2) for authenticating users.
- [google-geocoding-api](https://developers.google.com/maps/documentation/geocoding/overview) for resolving addressses of the listings.

### Deployment

I had initially planned to deploy this using [docker](https://www.docker.com/) on a EC2 instance.But later changed my mind to [heroku](https://www.heroku.com/). Btw the code includes the Dockerfile if you plan to do.

## Getting Started

### Installing

- Since all the above mentioned services requires test API and ID keys, please go ahead and signup for these accounts and get the keys.
- Rename the sample.env files to .env in both the frontend and backend directories and add the test keys in it.

### Dependencies

- Just run `yarn` or `yarn install` in both the frontend and backend directories to install all the necessary dependancies.

### Running the website locally

- Just run `yarn dev` in both the frontend and backend directories to start the local development servers.

### That's it. Have fun 😃
