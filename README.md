# AnchorWatch BTC Transaction Viewer

## Firebase Setup

This project requires a Firebase project for Email link and Google login

## Steps to Create `firebaseConfig.js` and Deploy React App to Firebase

### 1. Create a Firebase Project

1. **Go to Firebase Console**:

   - Open [Firebase Console](https://console.firebase.google.com/).

2. **Add a New Project**:
   - Click "Add project".
   - Enter a project name and click "Continue".
   - Optionally enable Google Analytics.
   - Click "Create project" and wait for it to be created.
   - Click "Continue" to open your new project.

### 2. Add a Web App to Your Project

1. **Register Your App**:

   - In the Firebase project overview, click the web icon `</>` to create a new web app.
   - Enter a nickname for your app and click "Register app".

2. **Add Firebase SDK**:
   - Copy the provided Firebase SDK configuration.

### 3. Install Firebase SDK in Your React Project

1. **Install Firebase**:

   ```bash
   npm install firebase
   ```

2. **Create `firebaseConfig.js`**:

   ```js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APPID,
   };

   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const db = getFirestore(app);

   export { app, auth, db };
   ```

### 4. Add Environment Variables

1. **Create a `.env` File**:

   - In the root of your React project, create a file named `.env`.

2. **Add Firebase Config Values**:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   REACT_APP_FIREBASE_APPID=your_app_id_here
   ```

### 5. Enable Email and Google Authentication

1. **Go to Authentication Section**:
   - In the Firebase Console, go to the "Authentication" section from the left-hand menu.
2. **Set Up Sign-In Method**:
   - Go to the "Sign-in method" tab.
   - Enable "Email/Password" and click "Save".
   - Enable "Google" and click "Save".

## Local Development

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
