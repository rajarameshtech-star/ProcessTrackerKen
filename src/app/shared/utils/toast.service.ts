import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  showSuccess(message: string): void {
    window.alert(`✅ Success: ${message}`);
  }

  showError(message: string): void {
    window.alert(`❌ Error: ${message}`);
  }
}
