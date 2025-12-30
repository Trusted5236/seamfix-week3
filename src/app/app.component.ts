import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsCardComponent } from './products-card/products-card.component';
import { CommonModule } from '@angular/common';

interface Product {
  id : number,
  name: string,
  description : string,
  price : number,
  imageUrl : string
}

@Component({

  selector: 'app-root',
  imports: [NavbarComponent, ProductsCardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  products : Product[] = [
    {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High‑quality Bluetooth over‑ear headphones with noise cancellation.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    name: 'Classic Leather Wallet',
    description: 'Handmade genuine leather wallet with RFID protection.',
    price: 49.99,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1681589453747-53fd893fa420?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    name: 'Smartwatch',
    description: 'Fitness tracking smartwatch with heart rate monitor. Very durable.',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: '12‑cup programmable coffee maker with auto shut‑off.',
    price: 59.95,
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&w=400'
  },
  {
    id: 5,
    name: 'Backpack',
    description: 'Durable travel backpack with multiple compartments.',
    price: 69.99,
    imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?ixlib=rb-1.2.1&w=400'
  },
  {
    id: 6,
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with touch controls. DC and AC.',
    price: 34.50,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&w=400'
  }
  ]

  filteredProducts : Product[] = [...this.products]
  cart : Product[] = []

  onSearch(search : string){
    if (search === ''){
      this.filteredProducts = [...this.products]
    }else{
      this.filteredProducts = this.products.filter((item)=>item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }
  }

  onProductSelect(product : Product){
    const index = this.cart.findIndex(p => p.id.toString() === product.id.toString())

    if (index > -1){
      this.cart.splice(index, 1)
    }else{
      this.cart.push(product)
    } 
  }

  isSelected(productId: number): boolean {
    return this.cart.some(p => p.id === productId);
  }
}
