---
title: Google Firebase
description: How to deploy your Piral instance to the web using Google's Firebase Hosting.
---

# ![Google Firebase Logo](../logos/google-firebase.svg){height=24px} Deploy your Piral instance to Google's Firebase Hosting

[Firebase Hosting](https://firebase.google.com/products/hosting) is a service provided by Google's [Firebase](https://firebase.google.com/) app development platform, which can be used to deploy an Piral instance.

## How to deploy

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.
2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content.

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist/release",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```json
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. After running `npm run build`, deploy using the command `firebase deploy`.
