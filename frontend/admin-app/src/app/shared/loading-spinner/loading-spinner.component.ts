import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <div class="spinner"></div>
      <p class="loading-text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      min-height: 200px;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(250, 204, 21, 0.2);
      border-top-color: #facc15;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      margin-top: 16px;
      color: #9ca3af;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = true;
  @Input() message = 'Loading...';
}
