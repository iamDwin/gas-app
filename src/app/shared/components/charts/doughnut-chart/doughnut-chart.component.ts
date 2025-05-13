import { Component, Input, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Chart, ChartConfiguration } from "chart.js/auto";

@Component({
  selector: "app-doughnut-chart",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <canvas #chartCanvas></canvas>
    </div>
  `,
})
export class DoughnutChartComponent implements OnInit {
  @ViewChild("chartCanvas") chartCanvas!: ElementRef;
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() backgroundColor: string[] = [
    "#079455",
    "#34d399",
    "#6ee7b7",
    "#a7f3d0",
  ];

  private chart?: Chart;

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  // ... existing code ...
  private createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext("2d");

    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.backgroundColor,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
            },
          },
        },
        // Use type assertion to bypass TypeScript type checking
        // cutout: "50%" as any,
      },
    };

    this.chart = new Chart(ctx, config);
  }
  // ... existing code ...

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
