import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MapInteraction = {
    markedIncident: any,
    selectedRoute: any
}



const initialState: MapInteraction = {
    markedIncident: null,
    selectedRoute: null,
};

export const mapInteractionSlice = createSlice({
    name: 'map_interaction',
    initialState,
    reducers: {
        setMapInteraction: (state, action: PayloadAction<MapInteraction>) => {
             return action.payload;
        },
        clearMapInteraction: (state) => {
            return initialState;
        },
    },
});

export const { setMapInteraction, clearMapInteraction } = mapInteractionSlice.actions;

export const getMapInteraction = (state: RootState) => state.mapInteraction;

export default mapInteractionSlice.reducer;