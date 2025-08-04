import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistListComponent } from '../home/ui/checklist-list.component';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { FormModalComponent } from '../shared/ui/modal/form-modal.component';
import { ModalComponent } from '../shared/ui/modal/modal.component';
import { ChecklistItemService } from '../shared/data-access/checklist-item.service';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';

@Component({
  selector: 'app-checklist',
  imports: [ChecklistHeaderComponent, FormModalComponent, ModalComponent, ChecklistItemListComponent],
  template: `
    @if (checklist(); as checklist) {
      <app-checklist-header
        [checklist]="checklist"
        (addItem)="checklistItemBeingEdited.set({})"
        (resetChecklist)="checklistItemService.reset$.next($event)"
        (deleteAllItems)="checklistItemService.checklistRemoveAllItems$.next($event)"
      />
    }

    <app-checklist-item-list
      [checklistItems]="items()"
      (delete)="checklistItemService.remove$.next($event)"
      (edit)="checklistItemBeingEdited.set($event)"
      (toggle)="checklistItemService.toggle$.next($event)"
    />

    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template>
        <app-form-modal
          title="Create item"
          [formGroup]="checklistItemForm"
          (save)="
            checklistItemBeingEdited()?.id
              ? checklistItemService.edit$.next({
                  id: checklistItemBeingEdited()!.id!,
                  data: checklistItemForm.getRawValue()
                })
              : checklistItemService.add$.next({
                  item: checklistItemForm.getRawValue(),
                  checklistId: checklist()?.id!
                })
          "
          (close)="checklistItemBeingEdited.set(null)"
        ></app-form-modal>
      </ng-template>
    </app-modal>
  
  `,
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  params = toSignal(this.route.paramMap);

  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id')),
  );

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id')),
  );

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });
    
  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm.patchValue({
          title: checklistItem.title,
        });
      }
    });
  }
}