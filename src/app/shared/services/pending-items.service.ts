import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingItemsService {
  private pendingDeclarations = new BehaviorSubject<number>(0);
  private pendingAllocations = new BehaviorSubject<number>(0);
  private pendingNominations = new BehaviorSubject<number>(0);
  private pendingContracts = new BehaviorSubject<number>(0);

  pendingDeclarations$ = this.pendingDeclarations.asObservable();
  pendingAllocations$ = this.pendingAllocations.asObservable();
  pendingNominations$ = this.pendingNominations.asObservable();
  pendingContracts$ = this.pendingContracts.asObservable();

  constructor() {
    // Initialize with some demo data
    this.pendingDeclarations.next(3);
    this.pendingAllocations.next(2);
    this.pendingNominations.next(1);
    this.pendingContracts.next(4);
  }

  getTotalPendingCount(): Observable<number> {
    return new Observable(subscriber => {
      subscriber.next(
        this.pendingDeclarations.value +
        this.pendingAllocations.value +
        this.pendingNominations.value +
        this.pendingContracts.value
      );
    });
  }

  updatePendingDeclarations(count: number) {
    this.pendingDeclarations.next(count);
  }

  updatePendingAllocations(count: number) {
    this.pendingAllocations.next(count);
  }

  updatePendingNominations(count: number) {
    this.pendingNominations.next(count);
  }

  updatePendingContracts(count: number) {
    this.pendingContracts.next(count);
  }
}