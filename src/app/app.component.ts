import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LoadingComponent } from "./shared/components/loading/loading.component";
import { LoadingService } from "./core/services/loading.service";
import { ToastComponent } from "./shared/components/toast/toast.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, ToastComponent],
  template: `
    <app-loading [show]="isLoading" [message]="loadingMessage"></app-loading>
    <app-toast></app-toast>
    <router-outlet></router-outlet>
  `,
})
export class App {
  isLoading = false;
  loadingMessage = "Loading...";

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(
      (loading) => (this.isLoading = loading)
    );
    this.loadingService.message$.subscribe(
      (message) => (this.loadingMessage = message)
    );
  }
}
