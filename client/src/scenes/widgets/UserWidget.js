import {
    ManageAccountsOutlined,
    WorkOutlineOutlined
} from '@mui/icons-material';
import { Box, Typography, useTheme, Divider } from '@mui/material';

import UserImage from '../../components/UserImage';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useNavigate } from 'react-router-dom';

const UserWidget = (props) => {
    const { palette } = useTheme();
    const navigate = useNavigate();

    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    return (
        <WidgetWrapper>
            {/* FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${props.user._id}`)}
            >
                <FlexBetween gap="1rem">
                    <UserImage image={props.user.profilePhoto} />
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
                            {props.user.firstName + ' ' + props.user.lastName}
                        </Typography>
                        <Typography color={medium}>
                            {props.user.followers.length} Follower
                            {props.user.followers.length !== 1 ? 's' : null}
                        </Typography>
                    </Box>
                </FlexBetween>

                <ManageAccountsOutlined />
            </FlexBetween>
            {/* SECOND ROW */}
            {props.user.occupation !== '' && (
                <>
                    <Divider />
                    <Box p="1rem 0">
                        <Box display="flex" alignItems="center" gap="1rem">
                            <WorkOutlineOutlined
                                fontSize="large"
                                sx={{ color: main }}
                            />
                            <Typography color={medium}>
                                {props.user.occupation}
                            </Typography>
                        </Box>
                    </Box>
                </>
            )}
        </WidgetWrapper>
    );
};

export default UserWidget;
