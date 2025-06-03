# Deploying to Render.com

This guide will help you deploy your MERN E-Commerce application to Render.com.

## Prerequisites

1. A [Render](https://render.com/) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database
3. A [Cloudinary](https://cloudinary.com/) account for image uploads

## Step 1: Set Up MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Create a database user with read and write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for development or specific IPs for production
4. Get your MongoDB connection string from the "Connect" button

## Step 2: Set Up Cloudinary

1. Create a Cloudinary account or log in
2. From your dashboard, note your Cloud name, API Key, and API Secret
3. Create an upload preset for your application

## Step 3: Deploy to Render

### Deploy as a Web Service

1. Log in to your Render account
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Enter the following details:
   - **Name**: your-app-name
   - **Environment**: Node
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

5. Add the following environment variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.onrender.com
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

6. Click "Create Web Service"

## Step 4: Verify Deployment

1. Wait for the deployment to complete (this may take a few minutes)
2. Visit your app at `https://your-app-name.onrender.com`
3. Test all functionality to ensure everything works correctly

## Troubleshooting

If you encounter issues:

1. Check the Render logs for error messages
2. Verify your environment variables are set correctly
3. Make sure your MongoDB connection string is correct
4. Check that Cloudinary credentials are valid

## Updating Your Deployment

When you push changes to your GitHub repository, Render will automatically redeploy your application.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation) 