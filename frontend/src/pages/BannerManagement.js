import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import SummaryApi from '../common';
import ROLE from '../common/role';
import { useNavigate } from 'react-router-dom';

const BannerManagement = () => {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    mobileImageUrl: '',
    link: '',
    isActive: true,
    order: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate('/');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [user, navigate]);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getBanners.url, {
        method: SummaryApi.getBanners.method
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBanners(data.data.sort((a, b) => a.order - b.order));
      } else {
        toast.error(data.message || 'Failed to fetch banners');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle banner creation
  const handleCreateBanner = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(SummaryApi.createBanner.url, {
        method: SummaryApi.createBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Banner created successfully');
        setShowAddModal(false);
        setFormData({
          title: '',
          imageUrl: '',
          mobileImageUrl: '',
          link: '',
          isActive: true,
          order: 0
        });
        fetchBanners();
      } else {
        toast.error(data.message || 'Failed to create banner');
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      toast.error('Failed to create banner');
    }
  };

  // Handle banner update
  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(SummaryApi.updateBanner.url, {
        method: SummaryApi.updateBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          bannerId: currentBanner._id,
          ...formData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Banner updated successfully');
        setShowEditModal(false);
        setCurrentBanner(null);
        fetchBanners();
      } else {
        toast.error(data.message || 'Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner');
    }
  };

  // Handle banner deletion
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    
    try {
      const response = await fetch(SummaryApi.deleteBanner.url, {
        method: SummaryApi.deleteBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ bannerId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Banner deleted successfully');
        fetchBanners();
      } else {
        toast.error(data.message || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  // Open edit modal with banner data
  const openEditModal = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl,
      link: banner.link || '',
      isActive: banner.isActive,
      order: banner.order
    });
    setShowEditModal(true);
  };

  // Handle image upload
  const handleImageUpload = async (e, isMobile = false) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(SummaryApi.uploadImage.url, {
        method: SummaryApi.uploadImage.method,
        credentials: 'include',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          [isMobile ? 'mobileImageUrl' : 'imageUrl']: data.url
        }));
        toast.success(`${isMobile ? 'Mobile image' : 'Desktop image'} uploaded successfully`);
      } else {
        toast.error(data.message || `Failed to upload ${isMobile ? 'mobile' : 'desktop'} image`);
      }
    } catch (error) {
      console.error(`Error uploading ${isMobile ? 'mobile' : 'desktop'} image:`, error);
      toast.error(`Failed to upload ${isMobile ? 'mobile' : 'desktop'} image`);
    }
  };

  // Move banner up in order
  const moveBannerUp = async (banner, index) => {
    if (index === 0) return;
    
    try {
      const prevBanner = banners[index - 1];
      
      // Swap orders
      await fetch(SummaryApi.updateBanner.url, {
        method: SummaryApi.updateBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          bannerId: banner._id,
          order: prevBanner.order
        })
      });
      
      await fetch(SummaryApi.updateBanner.url, {
        method: SummaryApi.updateBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          bannerId: prevBanner._id,
          order: banner.order
        })
      });
      
      fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
      toast.error('Failed to reorder banners');
    }
  };

  // Move banner down in order
  const moveBannerDown = async (banner, index) => {
    if (index === banners.length - 1) return;
    
    try {
      const nextBanner = banners[index + 1];
      
      // Swap orders
      await fetch(SummaryApi.updateBanner.url, {
        method: SummaryApi.updateBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          bannerId: banner._id,
          order: nextBanner.order
        })
      });
      
      await fetch(SummaryApi.updateBanner.url, {
        method: SummaryApi.updateBanner.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          bannerId: nextBanner._id,
          order: banner.order
        })
      });
      
      fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
      toast.error('Failed to reorder banners');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add New Banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No banners found. Add your first banner!
                  </td>
                </tr>
              ) : (
                banners.map((banner, index) => (
                  <tr key={banner._id} className={banner.isActive ? '' : 'bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-20 w-32">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                      {banner.link && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          Link: {banner.link}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>{banner.order}</span>
                        <div className="flex flex-col">
                          <button 
                            onClick={() => moveBannerUp(banner, index)}
                            disabled={index === 0}
                            className={`text-gray-500 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-700'}`}
                          >
                            <FaArrowUp size={12} />
                          </button>
                          <button 
                            onClick={() => moveBannerDown(banner, index)}
                            disabled={index === banners.length - 1}
                            className={`text-gray-500 ${index === banners.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-700'}`}
                          >
                            <FaArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(banner)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
            <form onSubmit={handleCreateBanner}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Desktop Image
                  </label>
                  <div className="mb-2">
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      id="desktop-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="desktop-image"
                      className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Desktop Preview"
                        className="h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                    placeholder="Or enter image URL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mobile Image
                  </label>
                  <div className="mb-2">
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                      id="mobile-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="mobile-image"
                      className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                  {formData.mobileImageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.mobileImageUrl}
                        alt="Mobile Preview"
                        className="h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    name="mobileImageUrl"
                    value={formData.mobileImageUrl}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                    placeholder="Or enter image URL"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Banner</h2>
            <form onSubmit={handleUpdateBanner}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Desktop Image
                  </label>
                  <div className="mb-2">
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      id="edit-desktop-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="edit-desktop-image"
                      className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Desktop Preview"
                        className="h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mobile Image
                  </label>
                  <div className="mb-2">
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                      id="edit-mobile-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="edit-mobile-image"
                      className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                  {formData.mobileImageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.mobileImageUrl}
                        alt="Mobile Preview"
                        className="h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    name="mobileImageUrl"
                    value={formData.mobileImageUrl}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement; 