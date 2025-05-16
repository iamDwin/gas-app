import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
  selector: "app-line-chart",
  standalone: true,
  template: `
    <div class="relative">
      <div #chartContainer></div>
    </div>
  `,
  imports: [],
})
export class LineChartComponent implements OnInit {
  @ViewChild("chartContainer", { static: true }) chartContainer!: ElementRef;

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const options = {
      chart: {
        type: "line",
        height: 350,
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      series: [
        {
          name: "Declarations",
          data: [12, 25, 18, 30, 22, 35, 28, 40, 33, 45, 38, 50],
          color: "#FF0000", // Red
        },
        {
          name: "Nominations",
          data: [20, 15, 25, 18, 28, 22, 32, 27, 37, 30, 40, 35],
          color: "#079455", // Green
        },
      ],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    };

    const chart = new ApexCharts(this.chartContainer.nativeElement, options);
    chart.render();
  }
}
