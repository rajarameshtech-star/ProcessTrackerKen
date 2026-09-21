import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container" *ngIf="message">
      <div class="toast" [ngClass]="message.type">
        <span class="material-icons toast-icon">
          {{ message.type === 'success' ? 'check_circle' : 'error' }}
        </span>
        <span class="toast-text">{{ message.message }}</span>
        <button class="toast-close" (click)="close()">
          <span class="material-icons">close</span>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .toast {
      display: flex;
      align-items: center;
      min-width: 300px;
      max-width: 450px;
      padding: 14px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      background-color: white;
      border-left: 6px solid;
    }
    .toast.success { border-left-color: #10b981; }
    .toast.error { border-left-color: #ef4444; }
    .toast-icon {
      margin-right: 12px;
      font-size: 24px;
    }
    .toast.success .toast-icon { color: #10b981; }
    .toast.error .toast-icon { color: #ef4444; }
    .toast-text {
      flex: 1;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #334155;
      font-weight: 500;
      line-height: 1.4;
    }
    .toast-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .toast-close:hover { color: #475569; }
    .toast-close .material-icons { font-size: 20px; }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
    message: ToastMessage | null = null;
    private sub!: Subscription;
    private timer: any;

    constructor(private toastService: ToastService) { }

    ngOnInit(): void {
        this.sub = this.toastService.toastState$.subscribe(msg => {
            this.message = msg;

            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => this.close(), 5000);
        });
    }

    close(): void {
        this.message = null;
        if (this.timer) clearTimeout(this.timer);
    }

    ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }
}
