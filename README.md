This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Create a `.env` file in the project root with the following variables:

```
REACT_APP_API_KEY=...
REACT_APP_AUTH_DOMAIN=...
REACT_APP_DATABASE_URL=...
REACT_APP_PROJECT_ID=...
REACT_APP_STORAGE_BUCKET=...
REACT_APP_MESSAGING_SENDER_ID=...
REACT_APP_APP_ID=...
```

## Available Scripts

### `npm run dev`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder. Bundles React in production mode and optimizes for best performance.

### `npm start`

Starts the Express server that serves the production build. Run `npm run build` first.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

Ejects the build tool configuration (webpack, Babel, ESLint) into the project for full manual control.

## Deployment (Heroku)

This project uses Heroku's standard **Node.js buildpack** with an Express server to serve the static build.

### First-time setup

```bash
heroku buildpacks:clear
heroku buildpacks:set heroku/nodejs
```

Set the environment variables on Heroku:

```bash
heroku config:set REACT_APP_API_KEY=...
heroku config:set REACT_APP_AUTH_DOMAIN=...
heroku config:set REACT_APP_DATABASE_URL=...
heroku config:set REACT_APP_PROJECT_ID=...
heroku config:set REACT_APP_STORAGE_BUCKET=...
heroku config:set REACT_APP_MESSAGING_SENDER_ID=...
heroku config:set REACT_APP_APP_ID=...
```

### Deploy

```bash
git push heroku master
```

Heroku will automatically run `npm run build` via the `heroku-postbuild` script, then start the Express server with `npm start`.
