import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

// Interfaces
export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  brand: { name: string };
  productType: { name: string };
  image?: string; // Add if needed
}

export interface Brand {
  brandId: number;
  name: string;
}

export interface ProductType {
  productTypeId: number;
  name: string;
}
export interface ProductCount {
  name: string;
  count: number;
}

export interface TopProduct {
  name: string;
  price: number;
  brand: string;
  productType: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://localhost:7121/api/Store';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/ProductListing`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/Brands`);
  }

  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.apiUrl}/ProductTypes`);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddProduct`, formData);
  }

  getProductCountByBrand(): Observable<ProductCount[]> {
    return this.http.get<ProductCount[]>(`${this.apiUrl}/ProductCountByBrand`);
  }

  getProductCountByType(): Observable<ProductCount[]> {
    return this.http.get<ProductCount[]>(`${this.apiUrl}/ProductCountByProductType`);
  }

  getTopExpensiveProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/TopExpensiveProducts`);
  }
}
