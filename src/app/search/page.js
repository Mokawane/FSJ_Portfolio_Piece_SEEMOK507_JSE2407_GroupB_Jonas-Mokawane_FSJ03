"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://next-ecommerce-api.vercel.app/products?search=${query}`
        );
        if (!res.ok) throw new Error("Error fetching search results.");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="bg-white border p-2 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                <img src={product.images[0]} alt={product.title} className="w-full h-64 object-contain" />
                <h2 className="font-bold text-lg mt-2">{product.title}</h2>
                <p className="text-gray-600">Category: {product.category}</p>
                <p className="text-lg font-semibold">${product.price}</p>
              </div>
            </Link>
          ))
        ) : (
          <div>No products found for "{query}".</div>
        )}
      </div>
    </div>
  );
}
