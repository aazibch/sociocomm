import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useState, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import FollowingWidget from '../widgets/FollowingWidget';
import UserWidget from '../widgets/UserWidget';
import PostsSetupWidget from '../widgets/PostsSetupWidget';
import useHttp from '../../hooks/useHttp';
import AuthContext from '../../store/auth-context';

const ProfilePage = (props) => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const authCtx = useContext(AuthContext);
    // const token = useSelector((state) => state.token);
    const token = authCtx.token;
    const isNonMobileScreen = useMediaQuery('(min-width:1000px)');
    const { sendRequest } = useHttp();

    const getUser = useCallback(() => {
        const requestConfig = {
            url: `/api/v1/users/${userId}`,
            headers: { Authorization: `Bearer ${token}` }
        };

        const handleResponse = (response) => {
            setUser(response.data.user);
        };

        sendRequest(requestConfig, handleResponse);
    }, [userId, token, sendRequest]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    if (!user) return null;

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreen ? 'flex' : 'block'}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
                    <UserWidget user={user} />
                    <Box m="2rem 0" />
                    <FollowingWidget following={user.following} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreen ? '42%' : undefined}
                    mt={isNonMobileScreen ? undefined : '2rem'}
                >
                    <PostsSetupWidget userId={userId} isProfile />
                    {/* <NewPostWidget />
                    <PostsWidget userId={userId} isProfile /> */}
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;
