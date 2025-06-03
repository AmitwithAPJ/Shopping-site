import React, { useEffect, useState } from 'react'
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import SummaryApi from '../common';
import { Link } from 'react-router-dom';

// Fallback images in case no banners are available from the API
import fallbackImage1 from '../assest/banner/img1.webp'
import fallbackImage2 from '../assest/banner/img2.webp'
import fallbackImage3 from '../assest/banner/img3.jpg'

import fallbackMobileImage1 from '../assest/banner/img1_mobile.jpg'
import fallbackMobileImage2 from '../assest/banner/img2_mobile.webp'
import fallbackMobileImage3 from '../assest/banner/img3_mobile.jpg'

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback banner data in case API fails
    const fallbackBanners = [
        {
            title: "Banner 1",
            imageUrl: fallbackImage1,
            mobileImageUrl: fallbackMobileImage1,
            link: ""
        },
        {
            title: "Banner 2",
            imageUrl: fallbackImage2,
            mobileImageUrl: fallbackMobileImage2,
            link: ""
        },
        {
            title: "Banner 3",
            imageUrl: fallbackImage3,
            mobileImageUrl: fallbackMobileImage3,
            link: ""
        }
    ];

    // Fetch banners from API
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${SummaryApi.getBanners.url}?active=true`, {
                method: SummaryApi.getBanners.method
            });
            
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                setBanners(data.data);
            } else {
                // Use fallback banners if API returns no data
                setBanners(fallbackBanners);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
            // Use fallback banners if API fails
            setBanners(fallbackBanners);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const nextImage = () => {
        if (banners.length - 1 > currentImage) {
            setCurrentImage(prev => prev + 1);
        } else {
            setCurrentImage(0); // Loop back to first image
        }
    };

    const prevImage = () => {
        if (currentImage !== 0) {
            setCurrentImage(prev => prev - 1);
        } else {
            setCurrentImage(banners.length - 1); // Loop to last image
        }
    };

    useEffect(() => {
        // Auto-rotate banners every 5 seconds
        const interval = setInterval(() => {
            if (banners.length - 1 > currentImage) {
                nextImage();
            } else {
                setCurrentImage(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentImage, banners.length]);

    // Show loading skeleton while fetching banners
    if (loading) {
        return (
            <div className='container mx-auto px-4 rounded'>
                <div className='h-56 md:h-72 w-full bg-slate-200 animate-pulse rounded'></div>
            </div>
        );
    }

  return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-56 md:h-72 w-full bg-slate-100 relative overflow-hidden rounded-lg shadow-sm'>
                {/* Navigation arrows */}
                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl px-4'>
                        <button 
                            onClick={prevImage} 
                            className='bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all'
                            aria-label="Previous banner"
                        >
                            <FaAngleLeft />
                        </button>
                        <button 
                            onClick={nextImage} 
                            className='bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all'
                            aria-label="Next banner"
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                </div>

                {/* Desktop and tablet banners */}
              <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {banners.map((banner, index) => (
                        <div 
                            className='w-full h-full min-w-full min-h-full transition-all duration-500' 
                            key={banner._id || `desktop-banner-${index}`} 
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            {banner.link ? (
                                <Link to={banner.link}>
                                    <img 
                                        src={banner.imageUrl} 
                                        alt={banner.title} 
                                        className='w-full h-full object-cover'
                                    />
                                </Link>
                            ) : (
                                <img 
                                    src={banner.imageUrl} 
                                    alt={banner.title} 
                                    className='w-full h-full object-cover'
                                />
                            )}
                            </div>
                    ))}
              </div>

                {/* Mobile banners */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {banners.map((banner, index) => (
                        <div 
                            className='w-full h-full min-w-full min-h-full transition-all duration-500' 
                            key={banner._id || `mobile-banner-${index}`} 
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            {banner.link ? (
                                <Link to={banner.link}>
                                    <img 
                                        src={banner.mobileImageUrl} 
                                        alt={banner.title} 
                                        className='w-full h-full object-cover'
                                    />
                                </Link>
                            ) : (
                                <img 
                                    src={banner.mobileImageUrl} 
                                    alt={banner.title} 
                                    className='w-full h-full object-cover'
                                />
                            )}
                            </div>
                    ))}
              </div>

                {/* Banner indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={`indicator-${index}`}
                            className={`w-2 h-2 rounded-full transition-all ${
                                currentImage === index ? 'bg-red-600 w-6' : 'bg-white/70'
                            }`}
                            onClick={() => setCurrentImage(index)}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerProduct;