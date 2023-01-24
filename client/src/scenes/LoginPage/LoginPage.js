import { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

const LoginPage = () => {
    const [pageType, setPageType] = useState('login');
    const theme = useTheme();
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');

    const switchPageHandler = () => {
        if (pageType === 'login') setPageType('register');

        if (pageType === 'register') setPageType('login');
    };

    let form = <LoginForm switchPageHandler={switchPageHandler} />;

    if (pageType === 'register')
        form = <RegisterForm switchPageHandler={switchPageHandler} />;

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                >
                    SocioComm
                </Typography>
            </Box>

            <Box
                width={isNonMobileScreen ? '50%' : '93%'}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography fontWeight="500" varient="h5" sx={{ mb: '1.5rem' }}>
                    Welcome to SocioComm.
                </Typography>
                {form}
            </Box>
        </Box>
    );
};

export default LoginPage;
