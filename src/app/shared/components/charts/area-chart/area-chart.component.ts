import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
  selector: "app-area-chart",
  standalone: true,
  template: `
    <div class="relative">
      <div #chartContainer></div>
    </div>
  `,
  imports: [],
})
export class AreaChartComponent implements OnInit {
  @ViewChild("chartContainer", { static: true }) chartContainer!: ElementRef;

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const options = {
      chart: {
        type: "bar",
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
          name: "Approved",
          data: [28, 29, 33, 36, 32, 32, 33, 16, 20, 22, 23, 20],
          color: "#5CD97F", // Red
        },
        {
          name: "Pending",
          data: [18, 13, 16, 20, 22, 23, 20, 33, 36, 32, 32, 33],
          color: "#3359CC", // Green
        },
        {
          name: "Decline",
          data: [12, 11, 14, 18, 17, 13, 13, 22, 23, 20, 33, 36],
          color: "#CC3359", // Green
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
