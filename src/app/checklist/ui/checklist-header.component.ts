import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `
    <header>
      <a data-testid="back-button" routerLink="/home">Back</a>
      <h1 data-testid="checklist-title">
        {{ checklist().title }}
      </h1>
      <div>
        <button
          (click)="resetChecklist.emit(checklist().id)"
          data-testid="reset-items-button"
        >
          Reset
        </button>
        <button
          (click)="addItem.emit()"
          data-testid="create-checklist-item-button"
        >
          Add item
        </button>
        <button
          (click)="deleteAllItems.emit(checklist().id)"
          data-testid="delete-all-items-button"
        >
          Delete All items
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
  imports: [RouterLink],
})
export class ChecklistHeaderComponent {
  checklist = input.required<Checklist>();
  addItem = output();
  resetChecklist = output<string>();
  deleteAllItems = output<string>();
}