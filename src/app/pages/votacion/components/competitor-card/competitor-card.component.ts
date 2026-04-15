import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Local } from '../../models/local.model';

@Component({
  selector: 'app-competitor-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competitor-card.component.html',
  styleUrl: './competitor-card.component.css'
})
export class CompetitorCardComponent {
  @Input() local!: Local;
  @Input() index!: number;
  @Input() votes: number = 0;
  @Output() onVote = new EventEmitter<number>();

  showInfo = false;

  toggleInfo(event: Event): void {
    event.stopPropagation();
    this.showInfo = !this.showInfo;
  }

  vote(): void {
    this.onVote.emit(this.index);
  }

  goToLocation(): void {
    if (this.local.ubicacion) {
      window.open(this.local.ubicacion, '_blank');
    }
  }

  goToWhatsapp(): void {
    if (this.local.whatsapp) {
      window.open(this.local.whatsapp, '_blank');
    }
  }
}