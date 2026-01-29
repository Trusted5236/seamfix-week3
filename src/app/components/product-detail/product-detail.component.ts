import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  category: string = '';
  isInCart: boolean = false;
  loading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Get product ID from route parameter
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (!idParam) {
      this.router.navigate(['/not-found']);
      return;
    }

    const id = Number(idParam);

    // Get category from query parameters
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.category = params['category'] || 'Unknown';
      });

    // Fetch product by ID from API
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.product = data;
          this.isInCart = this.productService.isInCart(id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.loading = false;
          this.router.navigate(['/not-found']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToCart(): void {
    if (this.product) {
      this.productService.addToCart(this.product.id);
      this.isInCart = true;
    }
  }

  removeFromCart(): void {
    if (this.product) {
      this.productService.removeFromCart(this.product.id);
      this.isInCart = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}