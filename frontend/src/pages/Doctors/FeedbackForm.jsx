import React, { useState, useEffect } from 'react'
import { AiFillStar } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reviewService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';

const FeedbackForm = ({ doctor, onSubmitSuccess, onCancel }) => {
    const { user, token, role } = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!token) {
            toast.info('Please login to give feedback');
            navigate('/login');
        }

        // Only patients can give feedback
        if (token && role !== 'patient') {
            toast.info('Only patients can give feedback');
            if (onCancel) onCancel();
            else navigate(-1);
        }
    }, [token, role, navigate, onCancel]);

    const validateForm = () => {
        const newErrors = {};

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (reviewText.trim() === '') {
            newErrors.reviewText = 'Please write your review';
        } else if (reviewText.length < 5) {
            newErrors.reviewText = 'Review must be at least 5 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitReview = async e => {
        e.preventDefault();

        if (!token) {
            toast.info('Please login to give feedback');
            navigate('/login');
            return;
        }

        if (role !== 'patient') {
            toast.info('Only patients can give feedback');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Prepare review data
            const reviewData = {
                doctor: doctor._id,
                reviewText,
                rating
            };

            console.log('Submitting review for doctor ID:', doctor._id);
            console.log('Review data:', reviewData);

            // Call API to submit review
            const result = await reviewService.createReview(reviewData);
            console.log('Review submission result:', result);

            if (result.success) {
                toast.success('Review submitted successfully!');

                // Log the review data with user information
                console.log('New review with user data:', result.data);
                if (result.data.user) {
                    console.log('User photo in new review:', result.data.user.photo);
                }

                // If there's a callback for successful submission, call it with the new review
                if (onSubmitSuccess && result.data) {
                    onSubmitSuccess(result.data);
                } else {
                    // Reset form
                    setRating(0);
                    setReviewText('');

                    // If no callback, refresh the page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            } else {
                toast.error(result.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f5f7f9] p-5 rounded-lg border border-[#e6e9ec]">
            <div className="flex justify-between items-center mb-4">
                <h3 className='text-headingColor text-[18px] leading-6 font-bold'>
                    Write a Review
                </h3>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmitReview}>
                <div>
                    <h3 className='text-headingColor text-[15px] leading-6 font-semibold mb-2 mt-0'>
                        How would you rate the overall experience?
                    </h3>

                    <div className="flex items-center mb-1">
                        {[...Array(5).keys()].map((_,index) => {
                            index += 1;

                            return (
                                <button
                                    key={index}
                                    type='button'
                                    className={`${
                                        index <= ((rating && hover) || hover)
                                            ? 'text-yellowColor'
                                            : 'text-gray-400'
                                        } bg-transparent border-none outline-none text-[28px] cursor-pointer mr-1`}
                                    onClick={() => setRating(index)}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(rating)}
                                    onDoubleClick={() => {
                                        setHover(0)
                                        setRating(0);
                                    }}
                                    >
                                    <span>
                                        <AiFillStar/>
                                    </span>
                                </button>
                            );
                        })}
                        <span className="ml-2 text-sm text-gray-600">
                            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                        </span>
                    </div>

                    {errors.rating && (
                        <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                    )}
                </div>

                <div className='mt-[20px]'>
                    <h3 className='text-headingColor text-[15px] leading-6 font-semibold mb-2 mt-0'>
                        Share your feedback or suggestions
                    </h3>
                    <textarea
                        className={`border ${errors.reviewText ? 'border-red-500' : 'border-[#0066ff34]'} focus:outline outline-primaryColor w-full px-3 py-2 rounded-md`}
                        rows={4}
                        placeholder='Your review helps others learn about this doctor'
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                    >
                    </textarea>
                    {errors.reviewText && (
                        <p className="text-red-500 text-xs mt-1">{errors.reviewText}</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    {onCancel && (
                        <button
                            type='button'
                            className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100'
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type='submit'
                        className={`btn flex items-center justify-center gap-2 ${onCancel ? 'ml-auto' : 'w-full'}`}
                        disabled={loading}
                    >
                        {loading ? <HashLoader size={25} color="#ffffff" /> : 'Submit Feedback'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FeedbackForm