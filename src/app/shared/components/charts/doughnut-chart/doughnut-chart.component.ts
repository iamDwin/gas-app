import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
  selector: "app-doughnut-chart",
  standalone: true,
  template: `
    <div class="relative">
      <div #chartContainer></div>
    </div>
  `,
  imports: [],
})
export class DoughnutChartComponent implements OnInit {
  @ViewChild("chartContainer", { static: true }) chartContainer!: ElementRef;

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const options = {
      series: [44, 15, 12],
      chart: {
        width: "70%",
        type: "donut",
      },
      labels: ["Approved", "Pending", "Declined"],
      colors: ["#34d399", "#a7f3d0", "#CC3359"],

      // theme: {
      //   monochrome: {
      //     enabled: true,
      //   },
      // },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(this.chartContainer.nativeElement, options);
    chart.render();
  }
}
