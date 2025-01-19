import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './reducer';


export const selectUserState = createFeatureSelector<UserState>('userState');

// Select all users
export const selectUsers = createSelector(
  selectUserState,
  (state) => state?.users
);
