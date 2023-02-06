import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useHttp from '../../hooks/useHttp';

import NewPostWidget from './NewPostWidget';
import PostsWidget from './PostsWidget';

const PostsSetupWidget = (props) => {
    const [posts, setPosts] = useState(null);
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

    useEffect(() => {
        if (props.isProfile) {
            getUserPosts();
        } else {
            getFeedPosts();
        }
    }, [getUserPosts, getFeedPosts, props.isProfile]);

    const handlePostLikeOrUnlike = (postId) => {
        likeOrUnlikePost(postId.toString());
    };

    const handlePost = (data) => {
        const formData = new FormData();
        formData.append('content', data.post);

        if (data.image) {
            formData.append('postImage', data.image);
        }

        const requestConfig = {
            url: '/api/v1/posts',
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        };

        const handleResponse = (res) => {
            const updatedPosts = [res.data.post, ...posts];

            setPosts(updatedPosts);
        };

        sendRequest(requestConfig, handleResponse);
    };

    return (
        <>
            <NewPostWidget handlePost={handlePost} />
            {posts ? (
                <PostsWidget
                    posts={posts}
                    handlePostLikeOrUnlike={handlePostLikeOrUnlike}
                />
            ) : null}
        </>
    );
};

export default PostsSetupWidget;
