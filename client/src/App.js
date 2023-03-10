import { Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/HomePage/HomePage';
import LoginPage from './scenes/LoginPage/LoginPage';
import ProfilePage from './scenes/ProfilePage/ProfilePage';

import { useMemo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import AuthContext from './store/auth-context';

function App() {
    const authCtx = useContext(AuthContext);
    // const mode = useSelector((state) => state.mode);
    const mode = authCtx.mode;
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    // const isAuthenticated = Boolean(useSelector((state) => state.token));
    const isAuthenticated = Boolean(authCtx.token);

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    {isAuthenticated && (
                        <>
                            <Route path="/home" element={<HomePage />} />
                            <Route
                                path="/profile/:userId"
                                element={<ProfilePage />}
                            />
                        </>
                    )}
                </Routes>
            </ThemeProvider>
        </div>
    );
}

export default App;
