'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/400?text=Image+Not+Found';

/**
 * Component that displays detailed information about a specific product, 
 * including images, title, price, category, stock, reviews, etc.
 *
 * @component
 * @param {Object} params - Object containing the product ID from the URL.
 */
export default function ProductDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [images, setImages] = useState([]);

  /**
   * Fetches the product details from the API when the component mounts or the `id` changes.
   * Sets the product data, images, and the initial displayed image.
   *
   * @async
   * @function fetchProduct
   */
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.images.length > 0) {
          setImages(data.images);
          setCurrentImage(data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /**
   * Handles setting the fallback image when an error occurs while loading the product image.
   *
   * @param {Object} e - The event object.
   */
  const handleError = (e) => {
    e.target.src = FALLBACK_IMAGE_URL;
  };

  /**
   * Handles navigating back to the product list with preserved filters.
   *
   * @function handleBack
   */
  const handleBack = () => {
    const page = searchParams.get('page') || 1;
    const sortBy = searchParams.get('sortBy') || 'id';
    const order = searchParams.get('order') || 'asc';
    const category = searchParams.get('category') || '';
    const query = searchParams.get('query') || '';

    const queryParams = new URLSearchParams({
      page,
      sortBy,
      order,
      category,
      query,
    });

    router.push(`/products?${queryParams.toString()}`);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={handleBack} className="bg-gray-800 text-white p-2 rounded mb-4">
        Back to Products
      </button>
      
      <div className="flex flex-col md:flex-row">
        <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
          <div className="bg-gray-200 px-4 py-12 rounded-xl">
            <img
              src={currentImage}
              alt="Product"
              onError={handleError}
              className="w-full h-[400px] object-contain mx-auto rounded"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex flex-wrap justify-center gap-4 mx-auto">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="w-[90px] h-[60px] flex items-center justify-center bg-gray-200 rounded-xl p-2 cursor-pointer"
                  onClick={() => setCurrentImage(img)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={handleError}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 md:ml-4">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-xl text-gray-700 mb-4">Category: {product.category}</p>
          <p className="text-xl text-gray-700 mb-4">Price: ${product.price}</p>
          <p className="text-md text-gray-500 mb-6">{product.description}</p>

          {product.tags && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Tags:</h3>
              <ul className="list-disc pl-5">
                {product.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
          )}
          
          {product.rating && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Rating:</h3>
              <p>{product.rating} / 5</p>
            </div>
          )}
          
          {product.stock && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Stock:</h3>
              <p>{product.stock} items available</p>
            </div>
          )}

          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Reviews:</h3>
              <ul>
                {product.reviews.map((review, index) => (
                  <li key={index} className="border-b border-gray-200 pb-2 mb-2">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                    <p>{review.comment}</p>
                    <p className="font-semibold">Rating: {review.rating} / 5</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
