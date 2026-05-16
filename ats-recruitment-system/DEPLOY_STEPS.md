# 🚀 Deployment Steps (Render.com)

Follow these exact steps to deploy the application as a single Web Service on Render.

1. **Push your code to GitHub**
   Ensure all changes are committed and pushed to your `main` branch.

2. **Sign up / Log in**
   Go to [Render.com](https://render.com) and sign in with your GitHub account.

3. **Create a New Web Service**
   Click on the **"New +"** button in the top right corner and select **"Web Service"**.
   Connect the GitHub repository that holds this project.

4. **Configure the Web Service Details:**
   - **Name:** Choose a unique name (e.g., `ats-recruitment-system`)
   - **Region:** Choose the region closest to you
   - **Branch:** `main`
   - **Root Directory:** (Leave blank if `package.json` is at the root. If it's inside `ats-recruitment-system`, enter `ats-recruitment-system`)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. **Set Environment Variables:**
   Scroll down to the "Environment Variables" section. You MUST add every variable from your `.env` file exactly as they are named.
   
   Add the following keys:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `<your_atlas_connection_string>`
   - `JWT_SECRET` = `<your_jwt_secret>`
   - `SETUP_KEY` = `<your_setup_key>`
   - `CLOUDINARY_CLOUD_NAME` = `<your_cloud_name>`
   - `CLOUDINARY_API_KEY` = `<your_api_key>`
   - `CLOUDINARY_API_SECRET` = `<your_api_secret>`
   - `GMAIL_USER` = `<your_gmail_address>`
   - `GMAIL_PASS` = `<your_gmail_app_password>`

6. **Deploy!**
   Click **"Create Web Service"**. Render will now fetch the code, run `npm install`, automatically trigger the `postinstall` script (`npm run build`) to compile the React Vite frontend into the `/dist` folder, and finally execute `npm start` to boot up the Express server serving both the API and the React files!

7. **Finalize:**
   Once the build finishes and the service shows "Live", click the URL at the top of the Render dashboard. Copy this URL, paste it into the `README.md` under "Live Demo", commit, and push!
