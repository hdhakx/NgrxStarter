import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { UserService } from '../../service/home.service';
import { Store, select } from '@ngrx/store';
import { selectUsers } from '../../store/selector';
import * as UserActions from '../../store/action';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayData = false;
  userForm!: FormGroup;
  editingIndex: number | null = null;
  originalUserData: any[] = [];

  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private store: Store<any>
  ) { }

  ngOnInit(): void {
      this.store.pipe(select(selectUsers)).subscribe((users) => {
      const hpSettingConf = users;
      if (hpSettingConf && hpSettingConf.length>0) {
        let newdata = hpSettingConf;
        this.users=newdata;
        this.initializeForm();
    } else {
      this.fetchUsers();
    }
  });
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = [...data];
      this.store.dispatch(UserActions.loadUsers({ users: data }));
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.displayData=true;
    const userFormArray = this.users.map((user) =>
      this.fb.group({
        id: new FormControl(user.id),
        name: new FormControl(user.name),
        email: new FormControl(user.email),
        username: new FormControl(user.username),
      })
    );

    this.userForm = this.fb.group({
      users: this.fb.array(userFormArray),
    });

    this.originalUserData = JSON.parse(JSON.stringify(this.users));  // Backup the original data
  }

  get usersFormArray(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  getFormControl(group: AbstractControl, controlName: string): FormControl {
    const formGroup = group as FormGroup;
    return formGroup.get(controlName) as FormControl;
  }

  editRow(index: number): void {
    if (this.editingIndex !== null && this.editingIndex !== index) {
      this.revertRow(this.editingIndex); // Revert previous row changes
    }
    this.editingIndex = index;
  }

  saveRow(index: number): void {
    const updatedUser = this.usersFormArray.at(index).value;

    // Check if updatedUser exists before proceeding
    if (!updatedUser) {
      console.error('User data is invalid.');
      return;
    }

    const updatedUsers = [...this.users];

    updatedUsers[index] = {
      ...updatedUsers[index],
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    };
    this.users = updatedUsers;

    this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
      (response) => {
       this.store.dispatch(UserActions.loadUsers({ users: this.users }));
        this.editingIndex = null;
        this.ngOnInit();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
  
  revertRow(index: number): void {
    if (index !== null && index >= 0) {
      this.usersFormArray.at(index).patchValue(this.originalUserData[index]);
      this.editingIndex = null;
    }
  }
}