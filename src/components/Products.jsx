'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Sort from './Sort';
import Filter from './Filter';

/**
 * Component that fetches and displays a paginated list of products.
 * Allows users to filter by category, sort by price, search by keyword, 
 * and navigate through pages.
 *
 * The applied filtering, sorting, and search parameters are retained when 
 * navigating to a product's detail view and returning to the list.
 *
 * @component
 */
export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const initialSortBy = searchParams.get('sortBy') || 'id';
  const initialOrder = searchParams.get('order') || 'asc';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('query') || '';

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [order, setOrder] = useState(initialOrder);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const limit = 20;

  /**
   * Fetches products from the API based on search, filter, sort, and pagination parameters.
   * 
   * @async
   * @function fetchProducts
   */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const sortQuery = sortBy === 'id' ? 'id' : 'price';
      const orderQuery = order === 'asc' || sortBy === 'id' ? 'asc' : order;
      const categoryQuery = selectedCategory ? `&category=${selectedCategory}` : '';
      const searchQueryParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const skip = (page - 1) * limit;

      const res = await fetch(
        `https://next-ecommerce-api.vercel.app/products?limit=${limit}&skip=${skip}&sortBy=${sortQuery}&order=${orderQuery}${categoryQuery}${searchQueryParam}`
      );
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the URL with the current search, filter, sort, and pagination options.
   * Preserves the existing query parameters, including the searchQuery.
   * 
   * @function updateUrl
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

  /**
   * useEffect hook to fetch products and update the URL whenever 
   * the filtering parameters change (page, sortBy, order, selectedCategory, searchQuery).
   */
  useEffect(() => {
    fetchProducts();
    updateUrl();
  }, [page, sortBy, order, selectedCategory, searchQuery]);

  /**
   * Handles cycling through product images by showing the previous image.
   * 
   * @param {number} index - The index of the product in the products array.
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
   * @param {number} index - The index of the product in the products array.
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
   * Handles navigating to the next page of products.
   * 
   * @function handleNextPage
   */
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  /**
   * Handles navigating to the previous page of products.
   * 
   * @function handlePrevPage
   */
  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

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
                }
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
                  <img
                    src={product.images[0]}
                    alt={`${product.title} image`}
                    className="w-full h-full object-contain"
                  />
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
        <button className="bg-gray-800 text-white p-2 rounded" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
