# Cloudinary Upload Preset Setup Instructions

To fix the image upload issue, you need to create an upload preset in your Cloudinary account. Follow these steps:

## Step 1: Log in to Cloudinary
Go to [https://cloudinary.com/console](https://cloudinary.com/console) and log in to your account.

## Step 2: Navigate to Upload Settings
1. Click on the "Settings" icon in the sidebar
2. Select "Upload" from the dropdown menu

## Step 3: Create a New Upload Preset
1. Scroll down to the "Upload presets" section
2. Click "Add upload preset"
3. Configure the preset with these settings:
   - **Preset name**: `ml_default` (use this exact name)
   - **Signing Mode**: Select "Unsigned" (this is important!)
   - **Folder**: Enter "products" (optional, but helps organize your uploads)
   - **Access Mode**: Select "Public"

## Step 4: Save the Preset
Click the "Save" button at the bottom of the form.

## Step 5: Test Your Application
After creating the preset, go back to your application and try uploading an image again. The error should be resolved.

## Troubleshooting
If you still encounter issues:
1. Make sure the preset name in your code matches exactly: `ml_default`
2. Verify that the preset is set to "Unsigned" mode
3. Check that your Cloudinary cloud name is correct: `ddwo8iuhl`
4. Try clearing your browser cache and reloading the application

## Alternative Solution
If you continue to have issues with the upload preset, you can use the direct upload method with your API key by using the `uploadImageDirect.js` file we created. 