'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebase';

const ReviewForm = () => {
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    const token = await user.getIdToken();

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, review }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setReview(''); // Clear the review input on success
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setError('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <button type="submit">Submit Review</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default ReviewForm;
