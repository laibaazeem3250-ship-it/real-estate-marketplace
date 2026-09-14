import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProperties = createAsyncThunk('properties/fetchAll', async (filters = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/properties', { params: filters });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load properties');
  }
});

export const fetchPropertyById = createAsyncThunk('properties/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/properties/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load property');
  }
});

export const createProperty = createAsyncThunk('properties/create', async (propertyData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/properties', propertyData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create property');
  }
});

export const updateProperty = createAsyncThunk('properties/update', async ({ id, propertyData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/properties/${id}`, propertyData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update property');
  }
});

export const deleteProperty = createAsyncThunk('properties/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/properties/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete property');
  }
});

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProperty: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.items = state.items.map((p) => (p._id === action.payload._id ? action.payload : p));
        state.current = action.payload;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrentProperty } = propertySlice.actions;
export default propertySlice.reducer;
