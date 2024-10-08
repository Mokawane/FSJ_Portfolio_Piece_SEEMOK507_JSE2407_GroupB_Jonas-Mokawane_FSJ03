'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Sort from './Sort';
import Filter from './Filter';

/**
 * Component that displays a list of products with pagination, sorting, and filtering functionalities.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize states from search parameters
  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const initialSortBy = searchParams.get('sortBy') || 'id';
  const initialOrder = searchParams.get('order') || 'asc';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('query') || '';

  const [products, setProducts] = useState([]); // State to hold the list of products
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error messages
  const [sortBy, setSortBy] = useState(initialSortBy); // State for sorting criteria
  const [order, setOrder] = useState(initialOrder); // State for sort order (asc/desc)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory); // State for selected category
  const [searchQuery, setSearchQuery] = useState(initialSearch); // State for the search query
  const [page, setPage] = useState(initialPage); // State for pagination
  const [lastDoc, setLastDoc] = useState(null); // State to store the last document for pagination

  const limit = 20; // Number of products per page

  /**
   * Fetches products from the API route.
   * Includes pagination, sorting, filtering, and search parameters.
   *
   * @returns {Promise<void>}
   */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct the query parameters
      const sortQuery = sortBy === 'id' ? 'id' : 'price';
      const orderQuery = order === 'asc' || sortBy === 'id' ? 'asc' : order;
      const categoryQuery = selectedCategory ? `&category=${selectedCategory}` : '';
      const searchQueryParam = searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '';

      const res = await fetch(
        `/api/products?page=${page}&sortBy=${sortQuery}&order=${orderQuery}${categoryQuery}${searchQueryParam}`
      );

      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.products);
      setLastDoc(data.lastDoc); // Store lastDoc for pagination
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the URL with current search, filter, and pagination options.
   *
   * @returns {void}
   */
  const updateUrl = () => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('page', page);
    currentParams.set('sortBy', sortBy);
    currentParams.set('order', order);
    currentParams.set('category', selectedCategory || '');
    currentParams.set('query', searchQuery);
    const url = `${window.location.pathname}?${currentParams.toString()}`;
    router.push(url);
  };

  useEffect(() => {
    fetchProducts();
    updateUrl();
  }, [page, sortBy, order, selectedCategory, searchQuery]);

  /**
   * Handles cycling through product images by showing the previous image.
   *
   * @param {number} index - The index of the product whose images are being cycled.
   * @returns {void}
   */
  const handlePrev = (index) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) => {
        if (i === index) {
          const images = [...product.images];
          const lastImage = images.pop();
          images.unshift(lastImage);
          return { ...product, images };
        }
        return product;
      })
    );
  };

  /**
   * Handles cycling through product images by showing the next image.
   *
   * @param {number} index - The index of the product whose images are being cycled.
   * @returns {void}
   */
  const handleNext = (index) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) => {
        if (i === index) {
          const images = [...product.images];
          const firstImage = images.shift();
          images.push(firstImage);
          return { ...product, images };
        }
        return product;
      })
    );
  };

  /**
   * Handles the action of moving to the next page.
   *
   * @returns {void}
   */
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);

  /**
   * Handles the action of moving to the previous page.
   *
   * @returns {void}
   */
  const handlePrevPage = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-lg font-semibold text-red-500">Error: {error}</div>;

  return (
    <div>
      <Filter onCategoryChange={setSelectedCategory} />
      <Sort
        onSortChange={(name, value) => {
          if (name === 'sortBy') {
            if (value === 'id') {
              setSortBy('id');
              setOrder('asc');
            } else {
              setSortBy('price');
              setOrder(value.includes('asc') ? 'asc' : 'desc');
            }
          }
        }}
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product, index) => (
          <li key={product.id} className="bg-white border p-2 shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <Link
              href={{
                pathname: `/product/${product.id}`,
                query: {
                  page,
                  sortBy,
                  order,
                  category: selectedCategory,
                  query: searchQuery,
                },
              }}
            >
              <div className="relative">
                {product.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-0 bg-gray-800 text-white p-2 rounded-full top-1/2 transform -translate-y-1/2 font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrev(index);
                      }}
                    >
                      &lt;
                    </button>
                    <button
                      className="absolute right-0 bg-gray-800 text-white p-2 rounded-full top-1/2 transform -translate-y-1/2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNext(index);
                      }}
                    >
                      &gt;
                    </button>
                  </>
                )}
                <div className="w-full h-64 overflow-hidden rounded-t-lg">
                  <img src={product.images[0]} alt={`${product.title} image`} className="w-full h-full object-contain" />
                </div>
                <div className="p-2">
                  <h2 className="mt-2 font-bold text-lg">{product.title}</h2>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-lg font-semibold mt-1">${product.price}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4 px-4">
        <button className="bg-gray-800 text-white p-2 rounded" onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <button className="bg-gray-800 text-white p-2 rounded" onClick={handleNextPage} disabled={!lastDoc}>
          Next
        </button>
      </div>
    </div>
  );
}
