import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';

// ---- Thunks ---------------------------------------------------------------

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployees();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Used by the Edit flow to pre-populate the form.
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Used by the "Search by ID" page - kept separate from fetchEmployeeById so
// searching never clobbers the employee currently loaded in the edit form.
export const searchEmployeeById = createAsyncThunk(
  'employees/searchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (data, { rejectWithValue }) => {
    try {
      return await employeeService.createEmployee(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await employeeService.updateEmployee(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      return await employeeService.deleteEmployee(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---- Slice ------------------------------------------------------------

const initialState = {
  items: [],
  listStatus: 'idle', // idle | loading | succeeded | failed
  listError: null,

  selectedEmployee: null,
  selectedStatus: 'idle',
  selectedError: null,

  searchResult: null,
  searchStatus: 'idle', // idle | loading | succeeded | failed | not-found
  searchError: null,

  operationStatus: 'idle', // idle | loading | succeeded | failed
  operationError: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSearchResult(state) {
      state.searchResult = null;
      state.searchStatus = 'idle';
      state.searchError = null;
    },
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
      state.selectedStatus = 'idle';
      state.selectedError = null;
    },
    clearOperationStatus(state) {
      state.operationStatus = 'idle';
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchEmployees.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload || 'Unable to load employees. Please try again.';
      })

      // fetch by id (edit prefill)
      .addCase(fetchEmployeeById.pending, (state) => {
        state.selectedStatus = 'loading';
        state.selectedError = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded';
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.selectedError = action.payload || 'Unable to load employee.';
      })

      // search by id
      .addCase(searchEmployeeById.pending, (state) => {
        state.searchStatus = 'loading';
        state.searchError = null;
        state.searchResult = null;
      })
      .addCase(searchEmployeeById.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResult = action.payload;
      })
      .addCase(searchEmployeeById.rejected, (state, action) => {
        state.searchResult = null;
        if (action.payload === 'Employee not found.') {
          state.searchStatus = 'not-found';
          state.searchError = null;
        } else {
          state.searchStatus = 'failed';
          state.searchError = action.payload || 'Unable to search employee. Please try again.';
        }
      })

      // create
      .addCase(createEmployee.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload || 'Unable to add employee. Please try again.';
      })

      // update
      .addCase(updateEmployee.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        const index = state.items.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload || 'Unable to update employee. Please try again.';
      })

      // delete
      .addCase(deleteEmployee.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        // Only ever remove on success - a failed delete must leave the
        // employee exactly where it was.
        state.items = state.items.filter((emp) => emp.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload || 'Unable to delete employee. Please try again.';
      });
  },
});

export const { clearSearchResult, clearSelectedEmployee, clearOperationStatus } = employeeSlice.actions;

export const selectEmployees = (state) => state.employees.items;
export const selectEmployeeListStatus = (state) => state.employees.listStatus;
export const selectEmployeeListError = (state) => state.employees.listError;
export const selectSelectedEmployee = (state) => state.employees.selectedEmployee;
export const selectSelectedEmployeeStatus = (state) => state.employees.selectedStatus;
export const selectSearchResult = (state) => state.employees.searchResult;
export const selectSearchStatus = (state) => state.employees.searchStatus;
export const selectSearchError = (state) => state.employees.searchError;
export const selectOperationStatus = (state) => state.employees.operationStatus;
export const selectOperationError = (state) => state.employees.operationError;

export default employeeSlice.reducer;
