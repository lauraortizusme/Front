// vote-realtime.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VoteService, StatisticsResponse } from './vote.service';

@Injectable({ providedIn: 'root' })
export class VoteRealtimeService implements OnDestroy {
  private statsSubject = new BehaviorSubject<StatisticsResponse | null>(null);
  stats$ = this.statsSubject.asObservable();

  private pollSub: Subscription | null = null;
  private readonly INTERVAL_MS = 15000; // cada 15 segundos

  constructor(private voteService: VoteService) {}

  startPolling(): void {
    if (this.pollSub) return; // ya está corriendo
    this.fetchNow();
    this.pollSub = interval(this.INTERVAL_MS)
      .pipe(switchMap(() => this.voteService.getStatistics()))
      .subscribe({
        next: (stats) => this.statsSubject.next(stats),
        error: (err) => console.warn('Polling error:', err)
      });
  }

  stopPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
  }

  fetchNow(): void {
    this.voteService.getStatistics().subscribe({
      next: (stats) => this.statsSubject.next(stats),
      error: (err) => console.warn('Fetch error:', err)
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}