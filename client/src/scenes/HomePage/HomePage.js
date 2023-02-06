import { Box, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import UserWidget from '../widgets/UserWidget';
import PostsWidget from '../widgets/PostsWidget';
import NewPostWidget from '../widgets/NewPostWidget';
import FollowingWidget from '../widgets/FollowingWidget';

const HomePage = () => {
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
    const loggedInUser = useSelector((state) => state.user);

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreen ? 'flex' : 'block'}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
                    <UserWidget user={loggedInUser} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreen ? '42%' : undefined}
                    mt={isNonMobileScreen ? 'undefined' : '2rem'}
                >
                    <NewPostWidget profilePhoto={loggedInUser.profilePhoto} />
                    <PostsWidget userId={loggedInUser._id} />
                </Box>
                {isNonMobileScreen && (
                    <Box flexBasis="26%">
                        <FollowingWidget following={loggedInUser.following} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default HomePage;
