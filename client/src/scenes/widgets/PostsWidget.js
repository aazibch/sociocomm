import PostWidget from './PostWidget';

const PostsWidget = (props) => {
    return (
        <>
            {props.posts.map((post) => (
                <PostWidget
                    handlePostLikeOrUnlike={props.handlePostLikeOrUnlike}
                    key={post._id}
                    post={post}
                />
            ))}
        </>
    );
};

export default PostsWidget;
