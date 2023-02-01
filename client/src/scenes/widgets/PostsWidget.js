import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state/auth';
import PostWidget from './PostWidget';
import useHttp from '../../hooks/useHttp';

const PostsWidget = (props) => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const { sendRequest } = useHttp();

    const getFeedPosts = useCallback(() => {
        const requestConfig = {
            url: 'api/v1/posts/feed',
            headers: { Authorization: `Bearer ${token}` }
        };

        const handleResponse = (response) => {
            dispatch(setPosts({ posts: response.data.posts }));
        };

        sendRequest(requestConfig, handleResponse);
    }, [dispatch, sendRequest, token]);

    const getUserPosts = useCallback(() => {
        const requestConfig = {
            url: `api/v1/posts/${props.userId}`,
            headers: { Authorization: `Bearer ${token}` }
        };

        const handleResponse = (response) => {
            dispatch(setPosts({ posts: response.data.posts }));
        };

        sendRequest(requestConfig, handleResponse);
    }, [dispatch, props.userId, sendRequest, token]);

    useEffect(() => {
        if (props.isProfile) {
            getUserPosts();
        } else {
            getFeedPosts();
        }
    }, [getUserPosts, getFeedPosts, props.isProfile]);

    return (
        <>
            {posts.map((post) => (
                <PostWidget key={post._id} post={post} />
            ))}
        </>
    );
};

export default PostsWidget;
