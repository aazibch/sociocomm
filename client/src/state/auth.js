import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light',
    user: {
        firstName: 'John',
        lastName: 'Doe'
    },
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
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        updatePost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id.toString() === action.payload.post._id.toString())
                    return action.payload.post;
                return post;
            });

            state.posts = updatedPosts;
        }
    }
});

export const {
    setMode,
    setLogin,
    setLogout,
    addToFollowing,
    removeFromFollowing,
    setPosts,
    updatePost
} = authSlice.actions;
export default authSlice.reducer;
