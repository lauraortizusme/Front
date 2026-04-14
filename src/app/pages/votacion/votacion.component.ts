import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { HeroComponent } from './components/hero/hero.component';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { CompetitorCardComponent } from './components/competitor-card/competitor-card.component';
import { VoteFormComponent } from './components/vote-form/vote-form.component';
import { StatisticsResponse } from '../../services/vote/vote.service';
import { VoteRealtimeService } from '../../services/vote/vote-realtime.service';
import { CompetitorService } from '../../services/competitor/competitor.service';
import { Local } from './models/local.model';

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [CommonModule, HeroComponent, StatsBarComponent, CompetitorCardComponent, VoteFormComponent],
  templateUrl: './votacion.component.html',
  styleUrl: './votacion.component.css'
})
export class VotacionComponent implements OnInit, OnDestroy {
  showForm = false;
  selectedOption: number | null = null;
  statistics: StatisticsResponse | null = null;
  private statsSub: Subscription | null = null;

  locales: Local[] = [];

  constructor(
    private realtimeService: VoteRealtimeService,
    private competitorService: CompetitorService
  ) {}

  ngOnInit(): void {
    this.realtimeService.startPolling();
    this.statsSub = this.realtimeService.stats$.subscribe(stats => {
      this.statistics = stats;
    });
    this.loadCompetitors();
  }

  loadCompetitors(): void {
  this.competitorService.getCompetitors().subscribe({
    next: (competitors) => {
      this.locales = competitors.map(c => ({
        nombre: c.nombre,
        imagen: this.getLocalImage(c.nombre),
        fondo: this.getLocalFondo(c.nombre),
        descripcion: c.descripcion,
        whatsapp: c.whatsapp,
        ubicacion: c.ubicacion
      }));
    },
    error: (err) => {
      console.error('Error cargando competidores:', err);
    }
  });
}

getLocalImage(nombre: string): string {
  const images: { [key: string]: string } = {
    'Crunchy Munch': 'assets/img/crunchy.png',
    'Crunchy Munch 2': 'assets/img/crunchy.png',
    'Dolcatto': 'assets/img/DOLCATO.jpeg',
    'Fratelli Repostería': 'assets/img/FRATELI.jpeg',
    'Koalas Bakery': 'assets/img/KOALAS.png',
    'Ancookies': 'assets/img/ANCOOKIES.jpeg'
  };
  return images[nombre] || 'assets/img/logo.png';
}

getLocalFondo(nombre: string): string {
  const fondos: { [key: string]: string } = {
    'Crunchy Munch': 'assets/img/CrunchyFondo.jpeg',
    'Crunchy Munch 2': 'assets/img/Crunchy2Fondo.jpeg',
    'Dolcatto': 'assets/img/DOLCATOFondo.jpeg',
    'Fratelli Repostería': 'assets/img/FratelliFondo.jpeg',
    'Koalas Bakery': 'assets/img/KoalasFondo.jpeg',
    'Ancookies': 'assets/img/AncookiesFondo.jpeg'
  };
  return fondos[nombre] || '';
}
  ngOnDestroy(): void {
    this.realtimeService.stopPolling();
    this.statsSub?.unsubscribe();
  }

  getVotesForOption(index: number): number {
    if (!this.statistics) return 0;
    const found = this.statistics.results.find(r => r.option === index);
    return found ? found.votes : 0;
  }

  getSelectedName(): string {
    return this.selectedOption !== null
      ? this.locales[this.selectedOption]?.nombre ?? ''
      : '';
  }

  onVote(index: number): void {
    this.selectedOption = index;
    this.showForm = true;
  }

  onCancelForm(): void {
    this.showForm = false;
    this.selectedOption = null;
  }
}