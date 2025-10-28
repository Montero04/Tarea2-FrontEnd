import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../interfaces';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent {
  @Input() products: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callDeleteMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
}