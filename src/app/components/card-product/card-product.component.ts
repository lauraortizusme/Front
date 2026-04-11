import { Component, Inject, Input, inject } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';

// ✅ Definir interfaces para los tipos de datos
interface Topping {
  _id: string;
  name: string;
}

interface IceCream {
  _id: string;
  name: string;
}

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [RouterLinkWithHref, ModalComponent, CommonModule],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.css',
})
export class CardProductComponent {
  private cartService = inject(CartService);

  @Input() _id: string = '';
  @Input() name: string = '';
  @Input() photo = '';
  @Input() description = '';
  @Input() recommendation = '';
  @Input() price: number = 0;
  
  // ✅ CAMBIO CRÍTICO: Cambiar de string a array de objetos
  @Input() iceCream: IceCream[] = [];
  @Input() toppings: Topping[] = [];

  get photoUrl(): string {
    return this.photo.startsWith('http')
      ? this.photo
      : `http://3.14.254.112:3000/api${this.photo}`;
  }

  isModalOpen = false;
  selectedProduct: any = null;

  openModal() {
    // ✅ Debug para verificar qué datos estamos recibiendo
    console.group('🔍 DEBUG - DATOS DEL PRODUCTO EN CARD');
    console.log('ID:', this._id);
    console.log('Name:', this.name);
    console.log('Toppings recibidos:', this.toppings);
    console.log('Ice Creams recibidos:', this.iceCream);
    console.log('Toppings es array?', Array.isArray(this.toppings));
    console.log('Ice Creams es array?', Array.isArray(this.iceCream));
    console.groupEnd();

    this.selectedProduct = {
      _id: this._id,
      name: this.name,
      photo: this.photo,
      description: this.description,
      recommendation: this.recommendation,
      price: this.price,
      // ✅ CAMBIO CRÍTICO: Pasar los arrays completos, no strings
      iceCream: this.iceCream,
      toppings: this.toppings,
    };
    
    console.log('🚀 Producto enviado al modal:', this.selectedProduct);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}