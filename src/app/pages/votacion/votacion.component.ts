import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { HeroComponent } from './components/hero/hero.component';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { CompetitorCardComponent } from './components/competitor-card/competitor-card.component';
import { VoteFormComponent } from './components/vote-form/vote-form.component';
import { StatisticsResponse } from '../../services/vote/vote.service';
import { VoteRealtimeService } from '../../services/vote/vote-realtime.service';
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

  locales: Local[] = [
    { nombre: 'Ancookies',  imagen: '../../../assets/img/Ancookies logo [Recuperado]-01.png', descripcion: 'Galletería artesanal con recetas únicas y sabores que te transportan a la infancia.' },
    { nombre: 'Galletery',  imagen: '../../../assets/img/Logotipo.PNG',                       descripcion: 'Un mundo de galletas creativas hechas con ingredientes premium y mucho amor.' },
    { nombre: 'Fratelli',   imagen: '../../../assets/img/Fratelli (15).png',                  descripcion: 'Tradición italiana convertida en galletas irresistibles para toda la familia.' },
    { nombre: 'Bluetopia',  imagen: '../../../assets/img/imagee.png',                         descripcion: 'Sabores sorprendentes que desafían los límites de la galletería moderna.' },
    { nombre: 'Koalas',     imagen: '../../../assets/img/images.png',                         descripcion: 'Galletas inspiradas en la naturaleza con ingredientes orgánicos y sostenibles.' },
    { nombre: 'Bruki',      imagen: '../../../assets/img/image.png',                          descripcion: 'Innovación y sabor se unen en cada bocado de esta galletería de vanguardia.' }
  ];

  constructor(private realtimeService: VoteRealtimeService) {}

  ngOnInit(): void {
    this.realtimeService.startPolling();
    this.statsSub = this.realtimeService.stats$.subscribe(stats => {
      this.statistics = stats;
    });
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