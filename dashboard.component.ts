import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ProductService, ProductCount, TopProduct } from '../services/product.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  // Chart Elements
  @ViewChild('brandChart') brandChartRef: any;
  @ViewChild('typeChart') typeChartRef: any;

  // Table Configuration
  displayedColumns: string[] = ['name', 'price', 'brand', 'productType', 'description'];
  dataSource = new MatTableDataSource<TopProduct>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Data Storage
  brandData: ProductCount[] = [];
  typeData: ProductCount[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadChartData();
    this.loadTopProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
// dashboard.component.ts
private loadChartData(): void {
  this.productService.getProductCountByBrand().subscribe(data => {
    console.log('Brand Data:', data);
    // Should log: [{name: "Nike", count: 15}, ...]
    this.createPieChart('brandChart', 'Products by Brand', data);
  });

  this.productService.getProductCountByType().subscribe(data => {
    console.log('Type Data:', data);
    // Should log: [{name: "Footwear", count: 20}, ...]
    this.createPieChart('typeChart', 'Products by Type', data);
  });
}

  private loadTopProducts(): void {
    this.productService.getTopExpensiveProducts().subscribe(data => {
      this.dataSource.data = data;
    });
  }


private createPieChart(chartId: string, title: string, data: ProductCount[]): void {
  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8AC249', '#EA5F89'
  ];

  // Directly use the incoming data without remapping
  const labels = data.map(d => d.name);
  const counts = data.map(d => d.count);

  const canvas = document.getElementById(chartId) as HTMLCanvasElement;
  const existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,  // Use directly from ProductCount.name
      datasets: [{
        label: title,
        data: counts,   // Use directly from ProductCount.count
        backgroundColor: colorPalette
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            generateLabels: (chart) => {
              return labels.map((label, index) => ({
                text: label || `Item ${index + 1}`,
                fillStyle: colorPalette[index % colorPalette.length],
                strokeStyle: '#fff',
                lineWidth: 1,
                hidden: false,
                index: index
              }));
            }
          }
        },
        title: {
          display: true,
          text: title,
          padding: 10
        }
      }
    }
  });
}
}
