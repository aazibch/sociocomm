import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowing } from '../../state/auth';

import User from '../../components/User';
import WidgetWrapper from '../../components/WidgetWrapper';
import useHttp from '../../hooks/useHttp';

const FollowingWidget = (props) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const following = useSelector((state) => state.user.following);
    const { sendRequest } = useHttp();

    const getFollowing = useCallback(() => {
        const requestConfig = {
            url: `/api/v1/users/${props.userId}/following`,
            headers: { Authorization: `Bearer ${token}` }
        };

        const handleResponse = (response) => {
            dispatch(setFollowing({ following: response.data.following }));
        };

        sendRequest(requestConfig, handleResponse);
    }, [dispatch, props.userId, sendRequest, token]);

    useEffect(() => {
        getFollowing();
    }, [getFollowing]);

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: '1.5rem' }}
            >
                Following
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {following.map((user) => (
                    <User key={user._id} user={user} />
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default FollowingWidget;
