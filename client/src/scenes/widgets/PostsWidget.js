import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import PostWidget from './PostWidget';
import useHttp from '../../hooks/useHttp';

const PostsWidget = (props) => {
    const [posts, setPosts] = useState();
    const token = useSelector((state) => state.token);
    const { sendRequest } = useHttp();

    const getFeedPosts = useCallback(() => {
        const requestConfig = {
            url: '/api/v1/posts/feed',
            headers: { Authorization: `Bearer ${token}` }
        };

        const handleResponse = (response) => {
            setPosts(response.data.posts);
        };

        sendRequest(requestConfig, handleResponse);
    }, [sendRequest, token]);

    const getUserPosts = useCallback(() => {
        const requestConfig = {
            url: `/api/v1/posts/${props.userId}`,
            headers: { Authorization: `Bearer ${token}` }
        };

        const handleResponse = (response) => {
            setPosts(response.data.posts);
        };

        sendRequest(requestConfig, handleResponse);
    }, [props.userId, sendRequest, token]);

    useEffect(() => {
        if (props.isProfile) {
            getUserPosts();
        } else {
            getFeedPosts();
        }
    }, [getUserPosts, getFeedPosts, props.isProfile]);

    if (!posts) {
        return null;
    }

    const likeOrUnlikePost = (postId) => {
        const requestConfig = {
            url: `/api/v1/posts/${postId}/likes`,
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const handleResponse = (res) => {
            const updatedPosts = posts.map((post) => {
                if (post._id.toString() === postId) {
                    return res.data.post;
                }

                return post;
            });

            setPosts(updatedPosts);
        };

        sendRequest(requestConfig, handleResponse);
    };

    const handlePostLikeOrUnlike = (postId) => {
        likeOrUnlikePost(postId.toString());
    };

    return (
        <>
            {posts.map((post) => (
                <PostWidget
                    handlePostLikeOrUnlike={handlePostLikeOrUnlike}
                    key={post._id}
                    post={post}
                />
            ))}
        </>
    );
};

export default PostsWidget;
