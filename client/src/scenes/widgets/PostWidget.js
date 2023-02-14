import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined
} from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import User from '../../components/User';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthContext from '../../store/auth-context';

const PostWidget = (props) => {
    const [showComments, setShowComments] = useState(false);
    const authCtx = useContext(AuthContext);
    // const loggedInUser = useSelector((state) => state.user);
    const loggedInUser = authCtx.user;
    const isLiked = props.post.likedBy.some(
        (userId) => userId.toString() === loggedInUser._id.toString()
    );
    const likeCount = props.post.likedBy.length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    return (
        <WidgetWrapper m="2rem 0">
            <User user={props.post.user} />
            <Typography color={main} sx={{ mt: '1rem' }}>
                {props.post.content}
            </Typography>
            {props.post.postImage && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
                    src={`/assets/postImages/${props.post.postImage}`}
                />
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton
                            onClick={() =>
                                props.handlePostLikeOrUnlike(props.post._id)
                            }
                        >
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton
                            onClick={() =>
                                setShowComments(
                                    (prevshowComments) => !prevshowComments
                                )
                            }
                        >
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{props.post.comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>
                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {showComments && (
                <Box mt="0.5rem">
                    {props.post.comments.map((comment, i) => (
                        <Box key={comment._id}>
                            <Divider />
                            <Typography
                                sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}
                            >
                                {comment.content}
                            </Typography>
                        </Box>
                    ))}
                    <Divider />
                </Box>
            )}
        </WidgetWrapper>
    );
};

export default PostWidget;
