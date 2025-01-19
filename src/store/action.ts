import { createAction, props } from '@ngrx/store';

// Action to load users
export const loadUsers = createAction(
    '[User] Load Users',
    props<{ users: any }>()
);

