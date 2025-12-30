import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-products-card',
  imports: [],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.scss'
})


export class ProductsCardComponent {
  @Input() product!: Product
  @Input() isSelected: boolean = false; 
  @Output() productClick = new EventEmitter<Product>();

  

  onClick(){
    this.productClick.emit(this.product)
  }
}
