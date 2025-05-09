import { useState, useEffect } from 'react'
import { formatDate } from '../../utils/formatDate'
import { AiFillStar } from 'react-icons/ai'
import { FaLock, FaCommentSlash, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa'
import FeedbackForm from './FeedbackForm'
import EditReviewForm from './EditReviewForm'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'
import { reviewService } from '../../services/api'

import avatar from '../../assets/images/avatar-icon.png'

const Feedback = ({ doctor }) => {
    const { token, user, role } = useAuth();
    const navigate = useNavigate();
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [deletingReview, setDeletingReview] = useState(null);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!doctor || !doctor._id) return;

            try {
                setLoading(true);
                setError('');

                console.log('Fetching reviews for doctor ID:', doctor._id);
                const result = await reviewService.getDoctorReviews(doctor._id);

                if (result.success) {
                    // Make sure we're only showing reviews for this specific doctor
                    const doctorReviews = result.data.filter(review =>
                        review.doctor === doctor._id ||
                        (review.doctor && review.doctor._id === doctor._id)
                    );

                    console.log('Filtered reviews for this doctor:', doctorReviews);

                    // Log user photos for debugging
                    doctorReviews.forEach((review, index) => {
                        console.log(`Review ${index} user:`, review.user);
                        if (review.user) {
                            console.log(`Review ${index} user photo:`, review.user.photo);
                        }
                    });

                    setReviews(doctorReviews);

                    // Check if current user has already reviewed this doctor
                    if (user && user._id) {
                        console.log('Current user:', user);

                        const userReviewObj = doctorReviews.find(review => {
                            // Check both populated user object and direct user ID reference
                            const isUserReview =
                                (review.user && review.user._id === user._id) ||
                                (review.user && typeof review.user === 'string' && review.user === user._id);

                            if (isUserReview) {
                                console.log('Found user review for this doctor:', review);
                            }

                            return isUserReview;
                        });

                        if (userReviewObj) {
                            setUserHasReviewed(true);
                            setUserReview(userReviewObj);
                        } else {
                            setUserHasReviewed(false);
                            setUserReview(null);
                        }
                    }
                } else {
                    setError(result.message || 'Failed to fetch reviews');
                }
            } catch (err) {
                setError('Failed to fetch reviews. Please try again.');
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [doctor, user]);

    const handleFeedbackClick = () => {
        if (!token) {
            toast.info('Please login to give feedback');
            navigate('/login');
            return;
        }

        if (userHasReviewed) {
            toast.info('You have already reviewed this doctor');
            return;
        }

        setShowFeedbackForm(true);
    };

    const handleFeedbackSubmitted = (newReview) => {
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setShowFeedbackForm(false);
        setUserHasReviewed(true);
        setUserReview(newReview);
    };

    const handleEditClick = (review) => {
        setEditingReview(review);
        setActionMenuOpen(null);
    };

    const handleEditSubmitted = (updatedReview) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review._id === updatedReview._id ? updatedReview : review
            )
        );
        setEditingReview(null);

        // Update userReview if this was the user's review
        if (userReview && userReview._id === updatedReview._id) {
            setUserReview(updatedReview);
        }
    };

    const handleDeleteClick = (reviewId) => {
        setDeletingReview(reviewId);
        setActionMenuOpen(null);

        if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            handleDeleteConfirm(reviewId);
        } else {
            setDeletingReview(null);
        }
    };

    const handleDeleteConfirm = async (reviewId) => {
        try {
            const result = await reviewService.deleteReview(reviewId);

            if (result.success) {
                toast.success('Review deleted successfully');

                // Remove the review from the list
                setReviews(prevReviews =>
                    prevReviews.filter(review => review._id !== reviewId)
                );

                // If this was the user's review, update state
                if (userReview && userReview._id === reviewId) {
                    setUserHasReviewed(false);
                    setUserReview(null);
                }
            } else {
                toast.error(result.message || 'Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review. Please try again.');
        } finally {
            setDeletingReview(null);
        }
    };

    const toggleActionMenu = (reviewId) => {
        if (actionMenuOpen === reviewId) {
            setActionMenuOpen(null);
        } else {
            setActionMenuOpen(reviewId);
        }
    };

    return (
        <div>
            <div className='mb-[50px]'>
                <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>
                    All reviews ({reviews.length})
                </h4>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <HashLoader size={30} color="#0067FF" />
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <FaCommentSlash className="text-gray-400 text-4xl mx-auto mb-3" />
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.map((review, index) => (
                        <div key={review._id || index} className='flex justify-between gap-10 mb-[30px] pb-5 border-b border-solid border-[#0066ff34]'>
                            <div className='flex gap-3 flex-1'>
                                <figure className='w-10 h-10 rounded-full overflow-hidden'>
                                    {review.user?.photo ? (
                                        <img
                                            src={review.user.photo}
                                            alt={review.user.name || "User"}
                                            className='w-full h-full object-cover rounded-full'
                                            onError={(e) => {
                                                console.log('Error loading user photo, falling back to avatar');
                                                e.target.src = avatar;
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={avatar}
                                            alt={review.user?.name || "User"}
                                            className='w-full h-full object-cover rounded-full'
                                        />
                                    )}
                                </figure>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>
                                            {review.user?.name || "Anonymous User"}
                                            {user && (user._id === review.user?._id || (review.user && user._id === review.user)) && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                    You
                                                </span>
                                            )}
                                        </h5>

                                        <div className="flex items-center">
                                            <div className='flex gap-1 mr-3'>
                                                {[...Array(5).keys()].map((_, idx) => (
                                                    <AiFillStar
                                                        key={idx}
                                                        color={idx < review.rating ? '#FFD700' : '#ccc'}
                                                        size={18}
                                                    />
                                                ))}
                                            </div>

                                            {/* Action menu for user's own reviews or admin */}
                                            {((user && (user._id === review.user?._id || (review.user && user._id === review.user))) || role === 'admin') && (
                                                <div className="relative">
                                                    <button
                                                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                                        onClick={() => toggleActionMenu(review._id)}
                                                    >
                                                        <FaEllipsisV size={14} />
                                                    </button>

                                                    {actionMenuOpen === review._id && (
                                                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                            {user && (user._id === review.user?._id || (review.user && user._id === review.user)) && (
                                                                <button
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                    onClick={() => handleEditClick(review)}
                                                                >
                                                                    <FaEdit className="mr-2" size={14} />
                                                                    Edit Review
                                                                </button>
                                                            )}
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                                onClick={() => handleDeleteClick(review._id)}
                                                            >
                                                                <FaTrash className="mr-2" size={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className='text-[14px] leading-6 text-textColor'>
                                        {formatDate(review.createdAt)}
                                    </p>
                                    <p className='text__para mt-3 font-medium text-[15px]'>
                                        {review.reviewText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!showFeedbackForm && !editingReview && (
                <div className='text-center'>
                    <button
                        className={`btn flex items-center justify-center gap-2 ${userHasReviewed ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                        onClick={handleFeedbackClick}
                        disabled={userHasReviewed}
                    >
                        {!token && <FaLock className="text-sm" />}
                        {userHasReviewed ? 'You already reviewed' : 'Give Feedback'}
                    </button>
                    {!token ? (
                        <p className='text-sm text-gray-500 mt-2'>
                            You need to be logged in to give feedback
                        </p>
                    ) : userHasReviewed ? (
                        <div className='text-sm text-gray-500 mt-2 flex justify-center gap-4'>
                            <p>You can only submit one review per doctor</p>
                            <button
                                className="text-primaryColor hover:underline"
                                onClick={() => handleEditClick(userReview)}
                            >
                                Edit your review
                            </button>
                        </div>
                    ) : null}
                </div>
            )}

            {showFeedbackForm && (
                <FeedbackForm
                    doctor={doctor}
                    onSubmitSuccess={handleFeedbackSubmitted}
                    onCancel={() => setShowFeedbackForm(false)}
                />
            )}

            {editingReview && (
                <EditReviewForm
                    review={editingReview}
                    onSubmitSuccess={handleEditSubmitted}
                    onCancel={() => setEditingReview(null)}
                />
            )}
        </div>
    )
}

export default Feedback