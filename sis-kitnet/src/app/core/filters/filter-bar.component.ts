import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="filter-bar card p-3 mb-3">
      <div class="filters"><ng-content></ng-content></div>
      <div class="filter-actions d-flex justify-content-end gap-2 mt-3">
        <button mat-raised-button color="primary" (click)="apply.emit()">Aplicar</button>
        <button mat-stroked-button (click)="clear.emit()">Limpar</button>
      </div>
    </div>
  `,
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent {
  @Output() apply = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
}
