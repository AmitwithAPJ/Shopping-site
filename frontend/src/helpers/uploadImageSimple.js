const cloudName = 'ddwo8iuhl';

const uploadImageSimple = async(image) => {
  // Create form data
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "ml_default"); // This is the default preset in Cloudinary
  
  try {
    // Make the request directly to the Cloudinary upload endpoint
    // Using 'image' instead of 'auto' for the resource_type
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });
    
    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload error:", errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    // Return the successful response
    const data = await response.json();
    console.log("Upload successful:", data);
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export default uploadImageSimple; 