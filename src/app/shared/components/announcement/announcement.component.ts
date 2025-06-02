import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonComponent } from "../button/button.component";

interface Announcement {
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: "app-announcement-bar",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
  templateUrl: "./announcement.component.html",
  styles: `
.announcement-container {
  overflow: hidden;
  position: relative;
  height: 120px; /* Adjust based on your content */
}

.announcement-slide {
  position: absolute;
  width: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-enter-active {
  transform: translateX(0);
}

.slide-exit {
  transform: translateX(0);
}

.slide-exit-active {
  transform: translateX(-100%);
}
  `,
})
export class AnnouncementBarComponent {
  @Input() announcements: Announcement[] = [];
  @Input() message = ""; // You can remove this if not needed anymore
  @Input() show = true;
  @Input() title = ""; // New input for title
  @Input() description = ""; // New input for description
  @Input() link: string | null = null; // New input for link
  currentIndex = 0;

  get currentAnnouncement() {
    return this.announcements[this.currentIndex];
  }

  nextAnnouncement() {
    this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
  }

  previousAnnouncement() {
    this.currentIndex =
      (this.currentIndex - 1 + this.announcements.length) %
      this.announcements.length;
  }

  onClose() {
    this.show = false;
  }
}
