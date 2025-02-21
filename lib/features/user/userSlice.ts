import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
    username: string;
    password: string;
    profileURL: string;
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: { username: 'nacroptic', password: 'A123', profileURL: 'https://ui-avatars.com/api/?name=nacroptic' },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const getUser = (state: RootState) =>  state.user.user;

export default userSlice.reducer;