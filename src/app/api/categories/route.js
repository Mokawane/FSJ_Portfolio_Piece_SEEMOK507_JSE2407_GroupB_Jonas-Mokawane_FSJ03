import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

/**
 * API route to fetch product categories from Firestore.
 *
 * @returns {Promise<NextResponse>} - The JSON response containing categories.
 */
export async function GET() {
  try {
    const categoriesRef = doc(db, 'categories', 'allCategories');
    const snapshot = await getDoc(categoriesRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Categories not found' }, { status: 404 });
    }

    const { categories } = snapshot.data(); // Get categories from Firestore document
    return NextResponse.json(categories); // Return the categories as JSON
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
