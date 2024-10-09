import { NextResponse } from 'next/server';
import { collection, query, where, limit as firestoreLimit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

/**
 * Fetches products from Firestore based on search, filter, and pagination parameters.
 *
 * @param {Request} req - The incoming request.
 * @returns {Promise<NextResponse>} - The JSON response containing products and last document ID.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = 20; // Number of products per page

    const productRef = collection(db, 'products');
    let q = query(productRef);

    // Apply search filter
    const search = searchParams.get('query') || '';
    if (search) {
      q = query(q, where('title', '>=', search), where('title', '<=', search + '\uf8ff'));
    }

    // Apply category filter
    const category = searchParams.get('category') || '';
    if (category) {
      q = query(q, where('category', '==', category));
    }

    // Pagination handling
    if (page > 1) {
      const previousPageQuery = query(productRef, firestoreLimit((page - 1) * limit));
      const previousPageSnapshot = await getDocs(previousPageQuery);
      const lastVisibleDoc = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
      q = query(q, startAfter(lastVisibleDoc));
    }

    // Apply limit to the query
    q = query(q, firestoreLimit(limit));

    // Fetch products
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Update lastDoc for pagination
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

    return NextResponse.json({ products, lastDoc });
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
