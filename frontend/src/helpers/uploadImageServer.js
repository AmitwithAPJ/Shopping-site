import SummaryApi from '../common';

const uploadImageServer = async(image) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("image", image);
    
    // Get the API base URL from the common file
    const baseUrl = SummaryApi.baseURL || 'http://localhost:5000/api';
    
    // Make the request to our server-side proxy
    const response = await fetch(`${baseUrl}/cloudinary/upload`, {
      method: "POST",
      credentials: 'include',
      body: formData
    });
    
    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server upload error:", errorText);
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

export default uploadImageServer; 