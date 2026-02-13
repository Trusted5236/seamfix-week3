import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StateService } from '../../services/state.service';
import { Product } from '../../models/product.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | undefined>;
  isInCart$!: Observable<boolean>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  category: string = '';
  productId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (!idParam) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.productId = Number(idParam);

    // Get category from query parameters
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || 'Unknown';
    });

    // Set observables
    this.loading$ = this.stateService.loading$;
    this.error$ = this.stateService.error$;
    this.product$ = this.stateService.getProductById$(this.productId);
    this.isInCart$ = this.stateService.isInCart$(this.productId);

    // Fetch product by ID from API
    this.productService.getProductById(this.productId).subscribe({
      error: (err) => {
        console.error('Error fetching product:', err);
        this.router.navigate(['/not-found']);
      }
    });
  }

  addToCart(): void {
    this.productService.addToCart(this.productId);
  }

  removeFromCart(): void {
    this.productService.removeFromCart(this.productId);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}