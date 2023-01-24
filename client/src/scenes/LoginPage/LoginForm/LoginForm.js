import { useState } from 'react';
import useHttp from '../../../hooks/useHttp';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../state/auth';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../../components/FlexBetween';

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email address.')
        .required('Field is required.'),
    password: yup.string().required('Field is required.')
});

const initialValuesLogin = {
    email: '',
    password: ''
};

const LoginForm = (props) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();
    const isNonMobile = useMediaQuery('(min-width: 600px)');

    const handleFormSubmit = async (values, onSubmitProps) => {
        const requestConfig = {
            url: '/api/v1/users/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                ...values
            }
        };

        const handleResponse = (response) => {
            dispatch(
                setLogin({ user: response.data.user, token: response.token })
            );
            navigate('/home');
        };

        await sendRequest(requestConfig, handleResponse);
    };

    return (
        <Formik
            enableReinitialize
            onSubmit={handleFormSubmit}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
            }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                '& > div': {
                                    gridColumn: isNonMobile
                                        ? undefined
                                        : 'span 4'
                                }
                            }}
                        >
                            <TextField
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={
                                    Boolean(touched.email) &&
                                    Boolean(errors.email)
                                }
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={
                                    Boolean(touched.password) &&
                                    Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: 'span 4' }}
                            />
                        </Box>

                        {/* BUTTONS */}
                        <Box>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: '2rem 0',
                                    p: '1rem',
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    '&:hover': {
                                        color: palette.primary.main
                                    }
                                }}
                            >
                                Login
                            </Button>
                            <Typography
                                onClick={() => {
                                    props.switchPageHandler();
                                    resetForm();
                                }}
                                sx={{
                                    textDecoration: 'underline',
                                    color: palette.primary.main,
                                    '&:hover': {
                                        cursor: 'pointer',
                                        color: palette.primary.light
                                    }
                                }}
                            >
                                Sign up here!
                            </Typography>
                        </Box>
                    </form>
                );
            }}
        </Formik>
    );
};

export default LoginForm;
