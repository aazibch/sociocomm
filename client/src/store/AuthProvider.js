import { useReducer } from 'react';
import AuthContext from './auth-context';

const defaultAuthState = {
    mode: 'light',
    user: null,
    token: null,
    posts: []
};

const authReducer = (state, action) => {
    if (action.type === 'setMode') {
        const mode = state.mode === 'light' ? 'dark' : 'light';

        return {
            ...state,
            mode
        };
    }

    if (action.type === 'setLogin') {
        console.log('authReducer', action.user, action.token);

        return {
            ...state,
            user: action.user,
            token: action.token
        };
    }

    if (action.type === 'setLogout') {
        return {
            ...state,
            token: null,
            user: null
        };
    }

    if (action.type === 'setFollowing') {
        const updatedUser = { ...state.user };
        updatedUser.following = action.following;

        return {
            ...state,
            user: updatedUser
        };
    }

    if (action.type === 'addToFollowing') {
        const updatedUser = { ...state.user };
        updatedUser.following = [{ ...action.user }, ...state.user.following];

        return {
            ...state,
            user: updatedUser
        };
    }

    if (action.type === 'removeFromFollowing') {
        const updatedUser = {
            ...state.user
        };

        updatedUser.following = state.user.following.filter((user) => {
            return user._id.toString() !== action.user._id.toString();
        });

        return {
            ...state,
            user: updatedUser
        };
    }

    return defaultAuthState;
};

const AuthProvider = (props) => {
    const [authState, dispatchAuthAction] = useReducer(
        authReducer,
        defaultAuthState
    );

    const setModeHandler = () => {
        dispatchAuthAction({ type: 'setMode' });
    };

    const setLoginHandler = (data) => {
        console.log('setLoginHandler', data);

        dispatchAuthAction({
            type: 'setLogin',
            token: data.token,
            user: data.user
        });
    };

    const setLogoutHandler = () => {
        dispatchAuthAction({ type: 'setLogout' });
    };

    const setFollowingHandler = (following) => {
        dispatchAuthAction({ type: 'setFollowing', following });
    };

    const addToFollowingHandler = (user) => {
        dispatchAuthAction({ type: 'addToFollowing', user });
    };

    const removeFromFollowingHandler = (user) => {
        dispatchAuthAction({ type: 'removeFromFollowing', user });
    };

    const context = {
        mode: authState.mode,
        user: authState.user,
        token: authState.token,
        posts: authState.posts,
        setModeHandler,
        setLoginHandler,
        setLogoutHandler,
        setFollowingHandler,
        addToFollowingHandler,
        removeFromFollowingHandler
    };

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
