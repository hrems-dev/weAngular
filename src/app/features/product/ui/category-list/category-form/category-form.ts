import { Component, inject, input, output, effect, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CategoryApi } from '../../../data/category-api';
import { CategoryResponse } from '../../../data/category.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, ToggleSwitchModule],
  providers: [],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnChanges {
  private categoryApi = inject(CategoryApi);
  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  $category = input<CategoryResponse | null>(null, { alias: 'category' });
  $saved = output({ alias: 'saved' });
  $cancelled = output({ alias: 'cancelled' });

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    isActive: [true],
  });

  ngOnChanges() {
    const category = this.$category();
    if (category) {
      this.form.patchValue(category);
    } else {
      this.form.reset({ isActive: true });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.value;
    const category = this.$category();

    if (category) {
      this.categoryApi.update(category.id, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Categoría actualizada correctamente',
          });

          this.$saved.emit();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la categoría',
          });

        },
      });
    } else {
      this.categoryApi.save(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Categoría creada correctamente',
          });

          this.$saved.emit();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la categoría',
          });

        },
      });
    }
  }
}
