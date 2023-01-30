import {
    ManageAccountsOutlined,
    WorkOutlineOutlined
} from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';

import UserImage from '../../components/UserImage';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHttp from '../../hooks/useHttp';

const UserWidget = () => {
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const { sendRequest } = useHttp();

    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    useEffect(() => {
        const getUser = async () => {
            sendRequest(
                {
                    url: '/api/v1/users/me',
                    headers: { Authorization: `Bearer ${token}` }
                },
                (response) => {
                    setUser(response.data.user);
                }
            );
        };

        getUser();
    }, [sendRequest, token]);

    if (!user) {
        return null;
    }

    return (
        <WidgetWrapper>
            {/* FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${user._id}`)}
            >
                <FlexBetween>
                    <UserImage image={`/profilePhotos/${user.profilePhoto}`} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                            sx={{
                                '$:hover': {
                                    color: palette.primary.light,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            {user.firstName + ' ' + user.lastName}
                        </Typography>
                        <Typography color={medium}>
                            {user.followers.length} Follower
                            {user.followers.length !== 1 ? 's' : null}
                        </Typography>
                    </Box>
                </FlexBetween>

                <ManageAccountsOutlined />
            </FlexBetween>
            {/* <Divider /> */}
            {/* SECOND ROW */}
            {user.occupation !== '' && (
                <Box p="1rem 0">
                    <Box
                        display="flex"
                        alignItems="center"
                        gap="1rem"
                        mb="0.5rem"
                    >
                        <WorkOutlineOutlined
                            fontSize="large"
                            sx={{ color: main }}
                        />
                        <Typography color={medium}>
                            {user.occupation}
                        </Typography>
                    </Box>
                </Box>
            )}
        </WidgetWrapper>
    );
};

export default UserWidget;
