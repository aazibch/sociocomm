import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light',
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFollowing: (state, action) => {
            state.user.following = action.payload.following;
        },
        addToFollowing: (state, action) => {
            if (state.user) {
                state.user.following = [
                    action.payload.user,
                    ...state.user.following
                ];
            } else {
                console.error('Not logged in.');
            }
        },
        removeFromFollowing: (state, action) => {
            if (state.user) {
                state.user.following = state.user.following.filter((user) => {
                    return (
                        user._id.toString() !==
                        action.payload.user._id.toString()
                    );
                });
            } else {
                console.error('Not logged in.');
            }
        }
    }
});

export const {
    setMode,
    setLogin,
    setLogout,
    setFollowing,
    addToFollowing,
    removeFromFollowing
} = authSlice.actions;
export default authSlice.reducer;
