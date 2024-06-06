import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, updateReview, deleteReview, handleShowToastMessage }) => {
    return (
        <Row>
            {reviews.length === 0 ? (
                <p>Non sono ancora state aggiunte recensioni.</p>
            ) : (
                reviews.map(review => (
                    <Col xs={12} key={review._id} className="mb-3">
                        <ReviewCard 
                            review={review} 
                            updateReview={updateReview}
                            deleteReview={deleteReview}
                            handleShowToastMessage={handleShowToastMessage}
                        />
                    </Col>
                ))
            )}
        </Row>
    );
};

export default ReviewList;
