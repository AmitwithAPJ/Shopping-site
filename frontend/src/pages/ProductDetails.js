import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import  { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  
  // Refs for image zoom functionality
  const imageContainerRef = useRef(null);
  const zoomedImageRef = useRef(null);
  
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [zoomLevel] = useState(2); // Zoom magnification level

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async() => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    });
    
    const dataResponse = await response.json();
    setLoading(false);
    
    if (dataResponse?.data) {
      setData(dataResponse.data);
      setActiveImage(dataResponse.data?.productImage[0]);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  // Handle mouse movement for zoom effect
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate cursor position as a percentage of the image dimensions
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
    setZoomPosition({ x, y });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const calculateDiscountPercentage = () => {
    if (!data.price || !data.sellingPrice) return 0;
    const discount = ((data.price - data.sellingPrice) / data.price) * 100;
    return Math.round(discount);
  };

  const handleAddToCart = async(e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async(e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='bg-white rounded-lg shadow-sm p-4 mb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-[100px,1fr,1fr] gap-6'>
          {/* Thumbnail images column */}
          <div className='h-full order-2 lg:order-1'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-auto scrollbar-none h-full'>
                {productImageListLoading.map((_, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage"+index}></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-auto scrollbar-none max-h-[400px]'>
                {data?.productImage?.map((imgURL, index) => (
                  <div 
                    className={`h-20 w-20 bg-slate-100 rounded p-1 border-2 transition-all ${activeImage === imgURL ? 'border-red-500' : 'border-transparent'}`} 
                    key={imgURL + index}
                  >
                    <img 
                      src={imgURL} 
                      alt={`${data.productName} view ${index+1}`} 
                      className='w-full h-full object-contain cursor-pointer' 
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main product image with zoom */}
          <div className='relative h-[300px] md:h-[400px] bg-white rounded order-1 lg:order-2' 
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {loading ? (
              <div className='h-full w-full bg-slate-200 animate-pulse rounded'></div>
            ) : (
              <>
                <div className='h-full w-full flex justify-center items-center p-2 overflow-hidden'>
                  <img 
                    src={activeImage} 
                    alt={data.productName} 
                    className='h-full w-full object-contain'
                  />
                </div>
                
                {/* Zoom overlay */}
                {isZooming && (
                  <div 
                    className='absolute top-0 right-0 transform translate-x-full bg-white border shadow-lg h-[400px] w-[400px] overflow-hidden z-10 hidden lg:block'
                    style={{ 
                      display: isZooming ? 'block' : 'none',
                    }}
                    ref={zoomedImageRef}
                  >
                    <img 
                      src={activeImage} 
                      alt={`${data.productName} zoomed`} 
                      className='absolute'
                      style={{
                        width: `${100 * zoomLevel}%`,
                        height: `${100 * zoomLevel}%`,
                        transform: `translate(-${zoomPosition.x * 100 * (zoomLevel - 1) / zoomLevel}%, -${zoomPosition.y * 100 * (zoomLevel - 1) / zoomLevel}%)`,
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Product details */}
          <div className='p-2 order-3'>
            {loading ? (
              <div className='flex flex-col gap-2'>
                <p className='h-4 bg-slate-200 animate-pulse rounded-full'></p>
                <h2 className='h-8 bg-slate-200 animate-pulse rounded-full'></h2>
                <p className='h-4 bg-slate-200 animate-pulse rounded-full'></p>
                <div className='h-4 bg-slate-200 animate-pulse rounded-full'></div>
                <div className='h-8 bg-slate-200 animate-pulse rounded-full'></div>
                <div className='flex items-center gap-3 my-2'>
                  <div className='h-10 w-28 bg-slate-200 animate-pulse rounded'></div>
                  <div className='h-10 w-28 bg-slate-200 animate-pulse rounded'></div>
                </div>
                <div>
                  <p className='h-4 bg-slate-200 animate-pulse rounded-full'></p>
                  <p className='h-28 bg-slate-200 animate-pulse rounded mt-1'></p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                <div className='flex justify-between items-start'>
                  <p className='bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block w-fit font-medium'>
                    {data?.brandName}
                  </p>
                  {calculateDiscountPercentage() > 0 && (
                    <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium'>
                      {calculateDiscountPercentage()}% OFF
                    </span>
                  )}
                </div>
                
                <h1 className='text-2xl lg:text-3xl font-medium text-gray-800'>{data?.productName}</h1>
                
                <div className='flex items-center gap-2'>
                  <p className='capitalize text-slate-500 border border-slate-300 px-2 py-0.5 rounded-full text-sm'>
                    {data?.category}
                  </p>
                  
                  <div className='text-yellow-500 flex items-center gap-1'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                    <span className='text-gray-600 text-sm ml-1'>(4.5)</span>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                  {data.price > data.sellingPrice && (
                    <p className='text-slate-400 line-through text-lg'>{displayINRCurrency(data.price)}</p>
                  )}
                </div>
                
                <div className='h-px bg-gray-200 my-2'></div>
                
                <div className='flex flex-col gap-2'>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Availability:</span> In Stock
                  </p>
                  
                  <div className='flex items-center gap-2 text-gray-700'>
                    <span className='font-medium'>Quantity:</span>
                    <div className='flex border rounded'>
                      <button className='px-3 py-1 border-r hover:bg-gray-100'>-</button>
                      <span className='px-4 py-1'>1</span>
                      <button className='px-3 py-1 border-l hover:bg-gray-100'>+</button>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 my-3'>
                  <button 
                    className='flex items-center justify-center gap-2 border-2 border-red-600 rounded-full px-6 py-2 min-w-[140px] text-white bg-red-600 hover:bg-red-700 transition-all font-medium' 
                    onClick={(e) => handleBuyProduct(e, data?._id)}
                  >
                    Buy Now
                  </button>
                  <button 
                    className='flex items-center justify-center gap-2 border-2 border-gray-800 rounded-full px-6 py-2 min-w-[140px] text-gray-800 hover:bg-gray-800 hover:text-white transition-all font-medium' 
                    onClick={(e) => handleAddToCart(e, data?._id)}
                  >
                    <FaShoppingCart /> Add To Cart
                  </button>
                  <button className='flex items-center justify-center w-10 h-10 border rounded-full hover:bg-gray-100'>
                    <FaRegHeart className='text-gray-600' />
                  </button>
                </div>
                
                <div className='h-px bg-gray-200 my-2'></div>

                <div>
                  <p className='text-gray-800 font-medium mb-2'>Description:</p>
                  <p className='text-gray-600 leading-relaxed'>{data?.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {data.category && (
        <div className='bg-white rounded-lg shadow-sm p-4'>
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Products"} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;