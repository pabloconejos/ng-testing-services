import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {


  products: Product[] = []


  constructor(
    private productsService: ProductService
  ) {

  }

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.productsService.getAllSimple().subscribe( products => {
      this.products = products
    })
  }
}
