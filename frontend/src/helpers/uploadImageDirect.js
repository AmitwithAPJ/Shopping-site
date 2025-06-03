/*
ALTERNATIVE UPLOAD METHOD USING API KEY
(Only use this if upload presets aren't working)

This method requires your Cloudinary API key to be exposed in the frontend code,
which is less secure than using unsigned upload presets.
*/

const cloudName = 'ddwo8iuhl';
const apiKey = '272215654481934'; // Replace with your actual Cloudinary API key

const uploadImageDirect = async(image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("api_key", apiKey);
  
  // Add timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  formData.append("timestamp", timestamp);
  
  // For direct uploads without a signature, we need to use unsigned upload
  formData.append("unsigned", "true");
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload error:", errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export default uploadImageDirect;

/*
NOTE: This method is NOT recommended for production use as it exposes your API key.
The proper approach is to:
1. Create an unsigned upload preset in your Cloudinary dashboard
2. Use that preset name in your upload code
*/ 