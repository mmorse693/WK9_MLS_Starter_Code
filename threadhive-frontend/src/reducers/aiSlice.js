import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchThreadSummary } from "../services/aiService";
import { handleApiError } from "../utils/handleApiError";

const initialState = {
  summary: null,
  loading: false,
  error: null,
};

export const summarizeThreadThunk = createAsyncThunk(
  "ai/summarizeThread",
  async (threadId, { rejectWithValue }) => {
    try {
      return await fetchThreadSummary(threadId);
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearSummary: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(summarizeThreadThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.summary = null;
      })
      .addCase(summarizeThreadThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(summarizeThreadThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aiSlice.reducer;
export const { clearSummary } = aiSlice.actions;
