import { Box, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import UserWidget from '../widgets/UserWidget';
import PostsWidget from '../widgets/PostsWidget';
import NewPostWidget from '../widgets/NewPostWidget';

const HomePage = () => {
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
    const user = useSelector((state) => state.user);
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
                    <UserWidget />
                </Box>
                <Box
                    flexBasis={isNonMobileScreen ? '42%' : undefined}
                    mt={isNonMobileScreen ? 'undefined' : '2rem'}
                >
                    <NewPostWidget profilePhoto={user.profilePhoto} />
                    <PostsWidget userId={user._id} />
                </Box>
                {isNonMobileScreen && <Box flexBasis="26%"></Box>}
            </Box>
        </Box>
    );
};

export default HomePage;
