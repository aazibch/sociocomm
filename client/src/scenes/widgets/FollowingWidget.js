import { Box, Typography, useTheme } from '@mui/material';

import User from '../../components/User';
import WidgetWrapper from '../../components/WidgetWrapper';

const FollowingWidget = (props) => {
    const { palette } = useTheme();

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
                {props.following.map((user) => (
                    <User key={user._id} user={user} />
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default FollowingWidget;
