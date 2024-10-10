import { NextResponse } from 'next/server';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

// Function to add a review (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, review } = body;

    // Ensure the review meets the required structure
    const { comment, rating, reviewerName, reviewerEmail } = review;

    if (!productId || !comment || rating == null || !reviewerName || !reviewerEmail) {
      return NextResponse.json({ error: 'Product ID, comment, rating, reviewer name, and reviewer email are required' }, { status: 400 });
    }

    // Reference the reviews collection for the product
    const reviewsRef = collection(db, `products/${productId}/reviews`);

    // Add the new review to Firestore
    const newReview = {
      comment,
      rating,
      reviewerName,
      reviewerEmail,
      date: new Date().toISOString(), // Add the current date
    };

    await addDoc(reviewsRef, newReview);

    return NextResponse.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

// Function to edit a review (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { productId, reviewId, review } = body;

    if (!productId || !reviewId || !review) {
      return NextResponse.json({ error: 'Product ID, review ID, and review are required' }, { status: 400 });
    }

    // Reference the review document
    const reviewRef = doc(db, `products/${productId}/reviews`, reviewId);

    // Update the review in Firestore
    await updateDoc(reviewRef, review);

    return NextResponse.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// Function to delete a review (DELETE)
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { productId, reviewId } = body;

    if (!productId || !reviewId) {
      return NextResponse.json({ error: 'Product ID and review ID are required' }, { status: 400 });
    }

    // Reference the review document
    const reviewRef = doc(db, `products/${productId}/reviews`, reviewId);

    // Delete the review from Firestore
    await deleteDoc(reviewRef);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
