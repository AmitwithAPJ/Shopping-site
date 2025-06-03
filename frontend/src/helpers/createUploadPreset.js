/*
INSTRUCTIONS FOR CREATING A CLOUDINARY UPLOAD PRESET

1. Log in to your Cloudinary account at https://cloudinary.com/console
2. Navigate to Settings > Upload
3. Click "Add upload preset"
4. Configure the preset:
   - Name: mern_product (use this exact name)
   - Signing Mode: Unsigned
   - Folder: products (optional)
   - Click Save

After creating the preset, update the uploadImage.js file to use "mern_product" as the upload_preset value.

Alternative method:
If you have API access, you can create a preset programmatically using the Admin API:

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

cloudinary.api.create_upload_preset({
  name: "mern_product",
  unsigned: true,
  folder: "products"
})
.then(result => console.log(result))
.catch(error => console.error(error));
*/ 