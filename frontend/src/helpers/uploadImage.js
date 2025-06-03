const cloudName = 'ddwo8iuhl';

const uploadImage = async(image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "mern_product");
  formData.append("cloud_name", cloudName);
  
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

export default uploadImage; 