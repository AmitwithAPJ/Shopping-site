import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { setUserDetails } from '../store/userSlice';

const Profile = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePic: ''
  });
  
  // Initialize user data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    // Reset form data to original user data when cancelling
    setUserData({
      name: user?.name || '',
      email: user?.email || '',
      profilePic: user?.profilePic || ''
    });
    setIsEditing(false);
  };
  
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Using the server-side upload method
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadResponse = await fetch(SummaryApi.uploadImage.url, {
        method: SummaryApi.uploadImage.method,
        credentials: 'include',
        body: formData
      });
      
      const data = await uploadResponse.json();
      
      if (data.success) {
        setUserData(prev => ({
          ...prev,
          profilePic: data.url
        }));
        toast.success('Profile picture uploaded successfully');
      } else {
        toast.error(data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?._id,
          name: userData.name,
          profilePic: userData.profilePic
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully');
        dispatch(setUserDetails({
          ...user,
          name: userData.name,
          profilePic: userData.profilePic
        }));
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  // Don't render until we have user data
  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            {userData.profilePic ? (
              <img 
                src={userData.profilePic} 
                alt={userData.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-6xl text-gray-400">
                <FaRegCircleUser />
              </div>
            )}
            
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleProfilePicUpload}
                  accept="image/*"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <p className="py-2 px-3 bg-gray-100 rounded">{user.email}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <p className="py-2 px-3 bg-gray-100 rounded">{user.role}</p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <p className="py-2 px-3 bg-gray-100 rounded">{user.name}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <p className="py-2 px-3 bg-gray-100 rounded">{user.email}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <p className="py-2 px-3 bg-gray-100 rounded">{user.role}</p>
            </div>
            
            <div className="flex items-center justify-center mt-6">
              <button
                type="button"
                onClick={handleEditClick}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 