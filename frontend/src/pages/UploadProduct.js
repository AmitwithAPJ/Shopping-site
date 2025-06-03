import uploadImageDirect from '../helpers/uploadImageDirect';

const handleUploadProduct = async(e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
        // Use the direct upload method instead
        const dataResponse = await uploadImageDirect(image)
        // ... existing code ...
    } catch (error) {
        console.error('Error uploading product:', error)
    } finally {
        setLoading(false)
    }
} 