import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { IProduct } from '../../interfaces';
import { ProductFormComponent } from '../../components/product/product-form/product-form.component';
import { ProductTableComponent } from '../../components/product/product-table/product-table.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    ProductTableComponent,
    LoaderComponent,
    PaginationComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public productService: ProductService = inject(ProductService);
  public categoryService: CategoryService = inject(CategoryService);
  public fb: FormBuilder = inject(FormBuilder);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  
  public isEdit: boolean = false;
  
  public form = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      console.log('products updated', this.productService.products$());
    });
  }

  ngOnInit() {
    this.categoryService.getAll();
    this.productService.getAll();
    this.route.data.subscribe( data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
      console.log('areActionsAvailable', this.areActionsAvailable);
    });
  }

  save(product: IProduct) {
    const categoryId = this.form.get('categoryId')?.value;
    
    if (this.isEdit && product.id) {
      product.category = { id: Number(categoryId) };
      this.productService.update(product);
    } else {
      product.category = { id: Number(categoryId) };
      this.productService.save(product);
    }
    this.form.reset();
    this.isEdit = false;
  }

  edit(product: IProduct) {
    this.isEdit = true;
    this.form.patchValue({
      id: product.id || 0,
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      quantity: product.quantity || 0,
      categoryId: product.category?.id?.toString() || ''
    });
  }

  delete(product: IProduct) {
    if (confirm(`Are you sure you want to delete the product "${product.name}"?`)) {
      this.productService.delete(product);
    }
  }
}