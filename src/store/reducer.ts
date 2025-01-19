import { createReducer, on } from '@ngrx/store';
import * as UserActions from './action';


// Define the state structure
export interface UserState {
  users: any;
}

// Initial state
const initialState: UserState = {
  users: [],
};

// Create the reducer
export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state, { users }) => ({
    ...state,
    users,
  }))
);
