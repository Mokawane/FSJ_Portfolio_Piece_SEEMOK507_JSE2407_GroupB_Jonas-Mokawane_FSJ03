import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

/**
 * Server-side API route to fetch a single product by its ID.
 */
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = { id: productDoc.id, ...productDoc.data() };
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
