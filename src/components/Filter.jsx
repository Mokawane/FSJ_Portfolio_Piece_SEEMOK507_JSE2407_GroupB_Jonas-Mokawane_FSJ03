'use client';

import { useEffect, useState } from 'react';

/**
 * Component for filtering products by category with dropdown buttons aligned on the x-axis.
 *
 * @component
 * @param {Function} onCategoryChange - Function to handle the category change.
 */
export default function Filter({ onCategoryChange }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [groupedCategories, setGroupedCategories] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://next-ecommerce-api.vercel.app/categories');
        const data = await res.json();
        groupCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const groupCategories = (categories) => {
    const groups = {
      'Men': ['mens-shirts', 'mens-shoes', 'mens-watches'],
      'Women': ['womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches'],
      'Accessories': ['sunglasses', 'mobile-accessories', 'sports-accessories', 'motorcycle', 'vehicle'],
      'Electronics': ['laptops', 'smartphones', 'tablets'],
      'Home & Living': ['furniture', 'home-decoration', 'kitchen-accessories'],
      'Beauty & Care': ['beauty', 'skin-care', 'fragrances'],
      'Groceries': ['groceries']
    };

    setGroupedCategories(groups);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    onCategoryChange(null);
  };

  const toggleDropdown = (groupName) => {
    setOpenDropdown((prev) => (prev === groupName ? null : groupName));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(groupedCategories).map(([groupName, subCategories]) => (
          <div key={groupName} className="relative">
            <button
              onClick={() => toggleDropdown(groupName)}
              className="bg-gray-200 text-left px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-300"
            >
              {groupName}
            </button>
            {openDropdown === groupName && (
              <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="flex flex-wrap gap-2 p-4">
                  {subCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCategory && (
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded transition hover:bg-red-600"
          onClick={handleClearFilter}
        >
          Clear Filter
        </button>
      )}
    </div>
  );
}
