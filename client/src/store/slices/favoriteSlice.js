import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/favorites');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load favorites');
  }
});

export const addFavorite = createAsyncThunk('favorites/add', async (propertyId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/favorites', { propertyId });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add favorite');
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (favoriteId, { rejectWithValue }) => {
  try {
    await api.delete(`/favorites/${favoriteId}`);
    return favoriteId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove favorite');
  }
});

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f._id !== action.payload);
      });
  },
});

export default favoriteSlice.reducer;
