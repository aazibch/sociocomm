import {
    EditOutlined,
    DeleteOutlined,
    ImageOutlined
} from '@mui/icons-material';
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useHttp from '../../hooks/useHttp';
import FlexBetween from '../../components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from '../../components/UserImage';
import WidgetWrapper from '../../components/WidgetWrapper';

const NewPostWidget = (props) => {
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState('');
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const { sendRequest } = useHttp();
    const loggedInUser = useSelector((state) => state.user);

    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const handlePost = () => {
        console.log('props', props);
        props.handlePost({ post, image });

        setPost('');
        setImage(null);
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={loggedInUser.profilePhoto} />
                <InputBase
                    placeholder="Speak your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: '100%',
                        backgroundColor: palette.neutral.light,
                        borderRadius: '2rem',
                        padding: '1rem 2rem'
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ '&:hover': { cursor: 'pointer' } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>
                                                {image.name}
                                            </Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: '15%' }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}
            <Divider sx={{ margin: '1.25rem 0' }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ '&:hover': { cursor: 'pointer', color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                <Button
                    disabled={!post}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: '3rem'
                    }}
                    onClick={handlePost}
                >
                    POST
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    );
};

export default NewPostWidget;
