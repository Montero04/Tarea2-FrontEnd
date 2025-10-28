import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../../interfaces';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent {
  @Input() categories: ICategory[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callDeleteMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
}