import { Box, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import UserWidget from '../widgets/UserWidget';
import MyPostWidget from '../widgets/MyPostWidget';

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
                    <MyPostWidget profilePhoto={user.profilePhoto} />
                </Box>
                {isNonMobileScreen && <Box flexBasis="26%"></Box>}
            </Box>
        </Box>
    );
};

export default HomePage;
