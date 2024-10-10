'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../../../../lib/firebase';
import { doc, addDoc, collection } from 'firebase/firestore';

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/400?text=Image+Not+Found';

/**
 * ProductDetail component displays the product details and allows users to add, edit, and delete reviews.
 * @param {Object} params - The route parameters.
 * @returns {JSX.Element} The rendered ProductDetail component.
 */
export default function ProductDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${id.padStart(3, '0')}`);
        const data = await res.json();
        setProduct(data);
        if (data.images.length > 0) {
          setImages(data.images);
          setCurrentImage(data.images[0]);
        }
        // Fetch existing reviews
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleError = (e) => {
    e.target.src = FALLBACK_IMAGE_URL;
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReview = async () => {
    // Ensure that the review fields are filled in properly before submitting
    if (!newReview.name || !newReview.comment || !newReview.rating) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const reviewData = { 
        ...newReview, 
        date: new Date().toLocaleString('en-GB', { timeZone: 'UTC', hour12: false }) // Format date as DD/MM/YYYY, HH:MM:SS
      };
      const reviewRef = await addDoc(collection(db, 'products', id, 'reviews'), reviewData);
      setReviews((prev) => [...prev, { id: reviewRef.id, ...reviewData }]); // Add new review to local state
      setNewReview({ name: '', comment: '', rating: '' }); // Reset form
    } catch (error) {
      console.error('Error adding review:', error);
      alert("There was an error adding your review. Please try again.");
    }
  };

  // Remaining methods and render logic...

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

          {reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Reviews:</h3>
              <ul>
                {reviews.map((review) => (
                  <li key={review.id} className="border-b border-gray-200 pb-2 mb-2">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                    <p>{review.comment}</p>
                    <p className="font-semibold">Rating: {review.rating} / 5</p>
                    <button onClick={() => handleDeleteReview(review.id)} className="text-red-500">
                      Delete
                    </button>
                    <button onClick={() => { 
                      setEditingReviewId(review.id); 
                      setNewReview({ name: review.name, comment: review.comment, rating: review.rating }); 
                    }} className="text-blue-500 ml-2">
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Add a Review:</h3>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={newReview.name}
                onChange={handleInputChange}
                className="border p-2 w-full mb-2"
              />
              <textarea
                name="comment"
                placeholder="Your Comment"
                value={newReview.comment}
                onChange={handleInputChange}
                className="border p-2 w-full mb-2"
              />
              <input
                type="number"
                name="rating"
                max="5"
                min="1"
                placeholder="Rating (1-5)"
                value={newReview.rating}
                onChange={handleInputChange}
                className="border p-2 w-full mb-2"
              />
              {editingReviewId ? (
                <button onClick={handleEditReview} className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Update Review
                </button>
              ) : (
                <button onClick={handleAddReview} className="bg-green-500 text-white px-4 py-2 rounded">
                  Add Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
