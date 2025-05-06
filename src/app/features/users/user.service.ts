import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = new BehaviorSubject<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      organizationId: '1'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'officer',
      organizationId: '1'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'viewer',
      organizationId: '2'
    },
    {
      id: '4',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'officer',
      organizationId: '2'
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'viewer',
      organizationId: '3'
    }
  ]);

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  addUser(user: Omit<User, 'id'>): void {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.users.next([...this.users.value, newUser]);
  }

  updateUser(user: User): void {
    const updated = this.users.value.map(u => 
      u.id === user.id ? user : u
    );
    this.users.next(updated);
  }

  deleteUser(id: string): void {
    const filtered = this.users.value.filter(u => u.id !== id);
    this.users.next(filtered);
  }
}