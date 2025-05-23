import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
  selector: "app-bar-chart",
  standalone: true,
  template: `
    <div class="relative">
      <div #chartContainer></div>
    </div>
  `,
  imports: [],
})
export class BarChartComponent implements OnInit {
  @ViewChild("chartContainer", { static: true }) chartContainer!: ElementRef;

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const options = {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
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
        zoom: {
          type: "x",
          enabled: false,
          autoScaleYaxis: true,
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
          name: "Nominations",
          data: [28, 29, 33, 36, 32, 32, 33, 14, 18, 17, 13, 13],
          color: "#117F63", // Red
        },
        // {
        //   name: "Nominations",
        //   data: [12, 11, 14, 18, 17, 13, 13],
        //   color: "#079455", // Green
        // },
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
