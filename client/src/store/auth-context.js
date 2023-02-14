import { createContext } from 'react';

const AuthContext = createContext({
    mode: 'light',
    user: null,
    token: null,
    posts: [],
    setModeHandler: () => {},
    setLoginHandler: (data) => {},
    setLogoutHandler: () => {},
    setFollowingHandler: (following) => {},
    addToFollowingHandler: (user) => {},
    removeFromFollowingHandler: (user) => {}
});

export default AuthContext;
