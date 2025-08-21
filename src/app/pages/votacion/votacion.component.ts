import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VoteService, VoteData } from '../../services/vote.service';

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './votacion.component.html',
  styleUrl: './votacion.component.css'
})
export class VotacionComponent {
  selectedOption: number | null = null; // Changed to number
  showForm: boolean = false;
  isSubmitting: boolean = false;
  
  // Definir las constantes para las opciones con números
  readonly Ancookies = 0;
  readonly Galletery = 1;
  readonly Fratelli = 2;
  readonly Bluetopia = 3;
  readonly Koalas = 4;
  readonly Bruki = 5;
  
  // Datos del formulario
  userData: VoteData = {
    nombreCompleto: '',
    cedula: '',
    telefono: '',
    correo: '',
    selectedOption: 0 // Changed to number
  };

  constructor(
    private router: Router,
    private voteService: VoteService
  ) {
    console.log('VoteService inyectado:', this.voteService);
  }

  // Método para seleccionar una opción
  selectOption(option: number): void {
    this.selectedOption = option;
    console.log('Opción seleccionada:', option);
  }

  // Método para ocultar votación y mostrar formulario
  confirmVote(): void {
    if (this.selectedOption === null) {
      alert('Debes seleccionar una galleta antes de confirmar tu voto');
      return;
    }

    console.log('Confirmando voto para opción:', this.selectedOption);
    this.userData.selectedOption = this.selectedOption;
    this.showForm = true;
  }

  // Método principal para enviar el formulario
  async submitForm(): Promise<void> {
    console.log('=== INICIO SUBMIT FORM ===');
    console.log('Datos actuales:', this.userData);
    console.log('Opción seleccionada:', this.selectedOption);

    // Validaciones
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    
    try {
      // Intentar verificar si ya votó
      console.log('Iniciando verificación de voto...');
      await this.checkIfAlreadyVoted();
      
      // Si llegamos aquí, no ha votado, proceder a crear el voto
      await this.sendVoteToBackend();
      
    } catch (error) {
      console.error('Error en submitForm:', error);
      this.handleError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  // Validar formulario
  private validateForm(): boolean {
    console.log('Validando formulario...');
    
    if (!this.userData.nombreCompleto.trim() || !this.userData.cedula.trim() || 
        !this.userData.telefono.trim() || !this.userData.correo.trim()) {
      alert('Por favor, completa todos los campos');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.userData.correo)) {
      alert('Por favor, ingresa un correo electrónico válido');
      return false;
    }

    if (!/^\d+$/.test(this.userData.cedula)) {
      alert('La cédula debe contener solo números');
      return false;
    }

    if (!/^\d{7,15}$/.test(this.userData.telefono)) {
      alert('El número de teléfono debe tener entre 7 y 15 dígitos');
      return false;
    }

    if (this.selectedOption === null) {
      alert('Error: No se ha seleccionado ninguna opción');
      return false;
    }

    console.log('Formulario válido ✓');
    return true;
  }

  // Verificar si ya ha votado (como Promise)
  private checkIfAlreadyVoted(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Verificando si ya votó con cédula:', this.userData.cedula);
      
      this.voteService.checkVote(this.userData.cedula.trim()).subscribe({
        next: (response) => {
          console.log('Respuesta de verificación:', response);
          
          if (response.hasVoted) {
            alert('Esta cédula ya ha sido utilizada para votar');
            reject(new Error('Ya ha votado'));
            return;
          }
          
          console.log('Usuario no ha votado, procediendo...');
          resolve();
        },
        error: (error: HttpErrorResponse) => {
          console.warn('Error en verificación, continuando sin verificar:', error);
          // Si la verificación falla, continuamos (quizás el endpoint no existe)
          resolve();
        }
      });
    });
  }

  // Enviar voto al backend
  private sendVoteToBackend(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Preparar datos limpios
      const voteData: VoteData = {
        nombreCompleto: this.userData.nombreCompleto.trim(),
        cedula: this.userData.cedula.trim(),
        telefono: this.userData.telefono.trim(),
        correo: this.userData.correo.trim().toLowerCase(),
        selectedOption: this.selectedOption! // This is now a number
      };

      console.log('=== ENVIANDO AL BACKEND ===');
      console.log('URL completa:', `${this.getBackendUrl()}`);
      console.log('Datos a enviar:', voteData);
      console.log('Headers que se enviarán:', this.getExpectedHeaders());

      // Realizar la petición
      this.voteService.createVote(voteData).subscribe({
        next: (response) => {
          console.log('✅ RESPUESTA EXITOSA DEL BACKEND:', response);
          alert('¡Tu voto ha sido registrado exitosamente!');
          this.router.navigate(['/Confirmacion Voto']);
          resolve();
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ ERROR DEL BACKEND:', error);
          reject(error);
        },
        complete: () => {
          console.log('Petición HTTP completada');
        }
      });
    });
  }

  // Obtener URL del backend para debugging
  private getBackendUrl(): string {
    return 'https://api.crunchy-munch.com/api/vote';
  }

  // Headers esperados para debugging
  private getExpectedHeaders(): object {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Manejo de errores mejorado
  private handleError(error: any): void {
    console.error('=== ERROR DETALLADO ===');
    console.error('Error completo:', error);
    
    if (error instanceof HttpErrorResponse) {
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('Error Body:', error.error);
      console.error('URL:', error.url);
      console.error('Headers:', error.headers);
    }
    
    let errorMessage = 'Error al procesar tu voto. Intenta nuevamente.';
    
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica:\n' +
                        '- Que el backend esté ejecutándose\n' +
                        '- La URL del servidor\n' +
                        '- Los CORS';
          break;
        case 404:
          errorMessage = 'Endpoint no encontrado (404). Verifica:\n' +
                        '- La ruta del backend\n' +
                        '- Que el endpoint exista';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos (400)';
          break;
        case 500:
          errorMessage = 'Error interno del servidor (500)';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    alert(errorMessage);
  }

  // Método para cancelar y volver a la votación
  cancelForm(): void {
    console.log('Cancelando formulario...');
    this.showForm = false;
    this.selectedOption = null;
    this.userData = {
      nombreCompleto: '',
      cedula: '',
      telefono: '',
      correo: '',
      selectedOption: 0
    };
  }

  // Método de debugging para probar la conexión
  testConnection(): void {
    console.log('=== PROBANDO CONEXIÓN ===');
    
    this.voteService.getStatistics().subscribe({
      next: (response) => {
        console.log('✅ Conexión exitosa - Estadísticas:', response);
        alert('Conexión con backend exitosa');
      },
      error: (error) => {
        console.error('❌ Error de conexión:', error);
        alert('Error de conexión con el backend');
      }
    });
  }

  // Helper method to get option name for display
  getOptionName(optionNumber: number): string {
    const options = ['Ancookies', 'Galletery', 'Fratelli', 'Bluetopia', 'Atlas', 'Bruki'];
    return options[optionNumber] || 'Opción desconocida';
  }
}