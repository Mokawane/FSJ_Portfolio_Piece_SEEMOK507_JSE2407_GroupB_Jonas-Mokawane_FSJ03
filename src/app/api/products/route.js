import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit as firestoreLimit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

/**
 * Fetches products from Firestore based on search, sort, filter, and pagination parameters.
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

    // Apply sorting
    const sortBy = searchParams.get('sortBy') || 'id';
    const order = searchParams.get('order') || 'asc';
    if (sortBy === 'price') {
      q = query(q, orderBy('price', order));
    } else {
      q = query(q, orderBy('id', order));
    }

    // Pagination handling
    if (page > 1) {
      // Fetch previous documents to find the last visible document
      const previousPageQuery = query(productRef, firestoreLimit((page - 1) * limit));
      const previousPageSnapshot = await getDocs(previousPageQuery);
      const lastVisibleDoc = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
      q = query(q, startAfter(lastVisibleDoc)); // Start after the last document of the previous page
    }

    // Apply limit to the query
    q = query(q, firestoreLimit(limit));

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Update lastDoc to the last visible document for pagination
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

    return NextResponse.json({ products, lastDoc });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
