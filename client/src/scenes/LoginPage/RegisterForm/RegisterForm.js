import { useContext } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../state/auth';

import useHttp from '../../../hooks/useHttp';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../store/auth-context';

const registerSchema = yup.object().shape({
    firstName: yup.string().required('Field is required.'),
    lastName: yup.string().required('Field is required.'),
    email: yup
        .string()
        .email('Invalid email address.')
        .required('Field is required.'),
    password: yup.string().required('Field is required.'),
    passwordConfirmation: yup.string().required('Field is required.'),
    occupation: yup.string().required('Field is required.')
});

const initialValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    occupation: ''
};

const RegisterForm = (props) => {
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery('(min-width: 600px)');
    const { sendRequest } = useHttp();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);

    const handleFormSubmit = async (values, onSubmitProps) => {
        const requestConfig = {
            url: '/api/v1/users/signup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                ...values
            }
        };

        const handleResponse = (response) => {
            // dispatch(
            //     setLogin({ user: response.data.user, token: response.token })
            // );
            authCtx.setLoginHandler({
                user: response.data.user,
                token: response.token
            });
            navigate('/home');
        };

        await sendRequest(requestConfig, handleResponse);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesRegister}
            validationSchema={registerSchema}
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
                                label="First Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.firstName}
                                name="firstName"
                                error={
                                    Boolean(touched.firstName) &&
                                    Boolean(errors.firstName)
                                }
                                helperText={
                                    touched.firstName && errors.firstName
                                }
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                label="Last Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lastName}
                                name="lastName"
                                error={
                                    Boolean(touched.lastName) &&
                                    Boolean(errors.lastName)
                                }
                                helperText={touched.lastName && errors.lastName}
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                label="Occupation"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.occupation}
                                name="occupation"
                                error={
                                    Boolean(touched.occupation) &&
                                    Boolean(errors.occupation)
                                }
                                helperText={
                                    touched.occupation && errors.occupation
                                }
                                sx={{ gridColumn: 'span 4' }}
                            />
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
                            <TextField
                                label="Confirm Password"
                                type="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.passwordConfirmation}
                                name="passwordConfirmation"
                                error={
                                    Boolean(touched.passwordConfirmation) &&
                                    Boolean(errors.passwordConfirmation)
                                }
                                helperText={
                                    touched.passwordConfirmation &&
                                    errors.passwordConfirmation
                                }
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
                                Register
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
                                Login instead.
                            </Typography>
                        </Box>
                    </form>
                );
            }}
        </Formik>
    );
};

export default RegisterForm;
