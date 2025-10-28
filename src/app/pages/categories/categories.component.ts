import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../interfaces';
import { CategoryFormComponent } from '../../components/category/category-form/category-form.component';
import { CategoryTableComponent } from '../../components/category/category-table/category-table.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    CategoryFormComponent,
    CategoryTableComponent,
    LoaderComponent,
    PaginationComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  public categoryService: CategoryService = inject(CategoryService);
  public fb: FormBuilder = inject(FormBuilder);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  
  public isEdit: boolean = false;
  
  public form = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    description: ['']
  });

  constructor() {
    effect(() => {
      console.log('categories updated', this.categoryService.categories$());
    });
  }

  ngOnInit() {
    this.categoryService.getAll();
    this.route.data.subscribe( data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
      console.log('areActionsAvailable', this.areActionsAvailable);
    });
  }

  save(category: ICategory) {
    if (this.isEdit && category.id) {
      this.categoryService.update(category);
    } else {
      this.categoryService.save(category);
    }
    this.form.reset();
    this.isEdit = false;
  }

  edit(category: ICategory) {
    this.isEdit = true;
    this.form.patchValue({
      id: category.id || 0,
      name: category.name || '',
      description: category.description || ''
    });
  }

  delete(category: ICategory) {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.categoryService.delete(category);
    }
  }
}