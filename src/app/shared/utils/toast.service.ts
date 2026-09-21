import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastState$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ type: 'success', message });
  }

  showError(message: string): void {
    this.toastSubject.next({ type: 'error', message });
  }
}
