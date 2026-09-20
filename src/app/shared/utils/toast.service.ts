import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  showSuccess(message: string): void {
    console.log('Success:', message);
  }

  showError(message: string): void {
    console.log('Error:', message);
  }
}
