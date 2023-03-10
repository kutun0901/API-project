import { csrfFetch } from "./csrf";


const LOAD_SPOT_REVIEW = "reviews/LOAD_SPOT_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW"
const ADD_REVIEW = "reviews/ADD_REVIEW"


const loadSpotReviews = (reviews) => {
    return {
        type: LOAD_SPOT_REVIEW,
        reviews
    }
}


const deleteReview = (id) => {
    return {
        type: DELETE_REVIEW,
        id
    }
}

const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotReviews(data.Reviews));
        // console.log("aaaa", data.Reviews);
        return data;
    }
}


export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteReview(reviewId));
    }
};

export const addReviewThunk = (review, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addReview(data));
        return data;
    }
}

const initialState = { spotReview: {} }
const reviewsReducer = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case LOAD_SPOT_REVIEW:
            const resObj = {}
            action.reviews.forEach(review => {
                resObj[review.id] = review;
            })
            return { ...state, spotReview: resObj }
        case DELETE_REVIEW:
            newState = { ...state }
            delete newState.spotReview[action.id]
            return {...state, ...newState.spotReview}

        case ADD_REVIEW:
            newState = { ...state};
            newState.spotReview[action.review.id] = action.review;
            return newState;

        default:
            return state;
    }
}

export default reviewsReducer;
