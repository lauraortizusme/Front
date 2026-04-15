import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { VoteService, VoteData } from '../../../../services/vote/vote.service';

@Component({
  selector: 'app-vote-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vote-form.component.html',
  styleUrl: './vote-form.component.css'
})
export class VoteFormComponent implements OnInit {
  @Input() selectedOption: number | null = null;
  @Input() selectedName: string = '';
  @Output() cancelForm = new EventEmitter<void>();

  isSubmitting = false;
  dataConsent = false;

  userData: VoteData = {
    nombreCompleto: '',
    documento: '',
    edad: 18,
    municipio: '',
    telefono: '',
    correo: '',
    selectedOption: 0,
    optionName: '',
    bestFlavor: '',
    bestAtention: '',
    bestPackaging: ''
  };

  readonly competitorOptions = [
    'Crunchy Munch',
    'Dolcatto',
    'Fratelli Repostería',
    'Koalas Bakery',
    'Ancookies',
    'Crunchy Munch 2'
  ];

  readonly municipios = [
    'Abejorral','Alejandría','Bello','Carmen de Viboral','Cocorná',
    'Concepción','El Peñol','El Retiro','El Santuario','Envigado',
    'Guarne','Guatapé','Itagui','La Ceja','La Unión','Medellin',
    'Rionegro','Sabaneta','Sonsón','Otro'
  ];

  constructor(private voteService: VoteService, private router: Router) {}

  ngOnInit(): void {
    if (this.selectedOption !== null) {
      this.userData.selectedOption = this.selectedOption;
    }
  }

  async submitForm(): Promise<void> {
    if (!this.validateForm()) return;
    this.isSubmitting = true;
    try {
      await this.checkIfAlreadyVoted();
      await this.sendVote();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  cancel(): void {
    this.cancelForm.emit();
  }

  // ── privados ──────────────────────────────────────────

  private validateForm(): boolean {
    const {
      nombreCompleto,
      documento,
      municipio,
      telefono,
      correo,
      edad,
      bestFlavor,
      bestAtention,
      bestPackaging
    } = this.userData;

    if (!nombreCompleto.trim() || !documento.trim() || !municipio.trim() || !telefono.trim() || !correo.trim()) {
      alert('Por favor, completa todos los campos'); return false;
    }
    if (!bestFlavor.trim() || !bestAtention.trim() || !bestPackaging.trim()) {
      alert('Debes seleccionar mejor sabor, mejor atención y mejor empaque'); return false;
    }
    if (!this.dataConsent) {
      alert('Debes aceptar el tratamiento de datos personales'); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert('Ingresa un correo electrónico válido'); return false;
    }
    if (!/^\d+$/.test(documento)) {
      alert('El documento debe contener solo números'); return false;
    }
    if (!/^\d{7,15}$/.test(telefono)) {
      alert('El teléfono debe tener entre 7 y 15 dígitos'); return false;
    }
    if (edad < 5 || edad > 100) {
      alert('La edad debe estar entre 5 y 100 años'); return false;
    }
    return true;
  }

  private checkIfAlreadyVoted(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.voteService.checkVote(this.userData.documento.trim()).subscribe({
        next: (res) => res.hasVoted
          ? reject(new Error('Ya votó'))
          : resolve(),
        error: () => resolve() // si falla el check, dejamos pasar
      });
    });
  }

  private sendVote(): Promise<void> {
    const optionName = this.selectedName.trim() || this.competitorOptions[this.selectedOption ?? -1] || '';
    const payload: VoteData = {
      ...this.userData,
      nombreCompleto: this.userData.nombreCompleto.trim(),
      documento:      this.userData.documento.trim(),
      telefono:       this.userData.telefono.trim(),
      correo:         this.userData.correo.trim().toLowerCase(),
      selectedOption: this.selectedOption!,
      optionName,
      bestFlavor: this.userData.bestFlavor.trim(),
      bestAtention: this.userData.bestAtention.trim(),
      bestPackaging: this.userData.bestPackaging.trim()
    };
    return new Promise((resolve, reject) => {
      this.voteService.createVote(payload).subscribe({
        next: () => { this.router.navigate(['/Confirmacion Voto']); resolve(); },
        error: (err: HttpErrorResponse) => reject(err)
      });
    });
  }

  private handleError(error: any): void {
    if (error?.message === 'Ya votó') {
      alert('Este documento ya ha sido utilizado para votar');
      return;
    }
    let msg = 'Error al procesar tu voto. Intenta nuevamente.';
    if (error instanceof HttpErrorResponse) {
      msg = error.status === 0
        ? 'No se puede conectar con el servidor.'
        : error.error?.message || msg;
    }
    alert(msg);
  }
}