import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToFollowing, removeFromFollowing } from '../state/auth';
import useHttp from '../hooks/useHttp';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import AuthContext from '../store/auth-context';

const User = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const loggedInUser = useSelector((state) => state.user);
    // const token = useSelector((state) => state.token);
    const { sendRequest } = useHttp();
    const authCtx = useContext(AuthContext);
    const loggedInUser = authCtx.user;
    const token = authCtx.token;

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;

    const isFollowing = loggedInUser.following.some((user) => {
        return user._id.toString() === props.user._id.toString();
    });

    const followOrUnfollowUser = () => {
        const requestConfig = {
            url: `/api/v1/users/me/following/${props.user._id.toString()}`,
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const handleResponse = (res) => {
            if (res.action === 'followed') {
                authCtx.addToFollowingHandler(res.data.user);
                // dispatch(addToFollowing({ user: res.data.user }));
            }

            if (res.action === 'unfollowed') {
                authCtx.removeFromFollowingHandler(res.data.user);
                // dispatch(removeFromFollowing({ user: res.data.user }));
            }
        };

        sendRequest(requestConfig, handleResponse);
    };

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={props.user.profilePhoto} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${props.user._id}`);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            '&:hover': {
                                color: palette.primary.light,
                                cursor: 'pointer'
                            }
                        }}
                    >
                        {`${props.user.firstName} ${props.user.lastName}`}
                    </Typography>
                </Box>
            </FlexBetween>
            <IconButton
                onClick={() => followOrUnfollowUser()}
                sx={{ backgroundColor: primaryLight, p: '0.6rem' }}
            >
                {isFollowing ? (
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                )}
            </IconButton>
        </FlexBetween>
    );
};

export default User;
