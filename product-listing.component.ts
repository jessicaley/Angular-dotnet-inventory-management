import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
  standalone: false
})
export class ProductListingComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['image', 'name', 'price', 'description', 'brandName', 'productTypeName'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Initialize here
    this.dataSource.sort = this.sort;
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilter(); // For multi-column filtering
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  // Custom filter for Name, Price, Brand, Type, Description
  customFilter() {
    return (data: any, filter: string): boolean => {
      const searchTerm = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchTerm) ||
        data.price.toString().includes(searchTerm) ||
        data.brandName.toLowerCase().includes(searchTerm) ||
        data.productTypeName.toLowerCase().includes(searchTerm) ||
        data.description.toLowerCase().includes(searchTerm)
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
