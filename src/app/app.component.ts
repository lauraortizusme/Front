// 📁 src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

// 📦 Componentes
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './components/cart/cart.component';

// 🎯 Servicio SEO
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent,
    ReactiveFormsModule,
    CartComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'Crunchy Munch - Deliciosas Cookies y Milkshakes';
  showMainLayout = true;
  showFooter = true;
  showHeader = true;

  constructor(
    private router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    console.log('🚀 Inicializando Crunchy Munch App...');
    this.seoService.setDefaultSeo();

    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log(`🔄 Navegando a: ${event.url}`);
        window.scrollTo(0, 0);
        this.updateSeoBasedOnRoute(event.url);

        this.showMainLayout = event.url !== '/';
        this.showFooter = !event.url.includes('/Votacion');
        this.showHeader = !event.url.includes('/Votacion');      });
  }

  private updateSeoBasedOnRoute(url: string) {
    const route = url.split('?')[0].toLowerCase().trim();
    console.log(`🎯 Actualizando SEO para ruta: ${route}`);

    switch (route) {
      case '/':
      case '/home':
        this.seoService.setDefaultSeo();
        break;
      case '/quien%20somos':
      case '/quien-somos':
        this.seoService.setAboutPageSeo();
        break;
      case '/cookie':
        this.seoService.setProductPageSeo('Cookie');
        break;
      case '/crookie':
        this.seoService.setProductPageSeo('Crookie');
        break;
      case '/milkshake':
        this.seoService.setProductPageSeo('Milkshake');
        break;
      case '/bebidas':
        this.seoService.setProductPageSeo('Bebidas');
        break;
      case '/nuestros%20productos':
      case '/nuestros-productos':
        this.seoService.updateSeoData({
          title: 'Nuestros Productos',
          description: 'Descubre toda nuestra gama de productos artesanales.',
          keywords: 'productos crunchy munch, menu completo',
          image: 'https://crunchy-munch.com/assets/og-productos.jpg'
        });
        break;
      case '/pqrs':
        this.seoService.updateSeoData({
          title: 'PQRS - Contacto',
          description: 'Contáctanos para peticiones, quejas, reclamos o sugerencias.',
          keywords: 'contacto crunchy munch, pqrs',
          image: 'https://crunchy-munch.com/assets/og-contact.jpg'
        });
        break;
      case '/tus%20pedidos':
      case '/tus-pedidos':
        this.seoService.updateSeoData({
          title: 'Tus Pedidos',
          description: 'Revisa el estado de tus pedidos en Crunchy Munch.',
          keywords: 'pedidos crunchy munch',
          image: 'https://crunchy-munch.com/assets/og-pedidos.jpg'
        });
        break;
      case '/login':
        this.seoService.updateSeoData({
          title: 'Iniciar Sesión',
          description: 'Inicia sesión en tu cuenta de Crunchy Munch.',
          keywords: 'login crunchy munch',
          image: 'https://crunchy-munch.com/assets/og-login.jpg'
        });
        break;
      default:
        this.seoService.setDefaultSeo();
    }
  }

  private setDynamicProductSeo(productSlug: string) {
    const productName = productSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    this.seoService.updateSeoData({
      title: `${productName} | Producto Especial`,
      description: `Descubre nuestro delicioso ${productName}.`,
      keywords: `${productSlug}, ${productName}`,
      image: `https://crunchy-munch.com/assets/products/${productSlug}.jpg`,
      type: 'product'
    });
  }

  private setDynamicCategorySeo(categorySlug: string) {
    const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    this.seoService.updateSeoData({
      title: `${categoryName} | Categoría`,
      description: `Explora nuestra selección de ${categoryName.toLowerCase()}.`,
      keywords: `${categorySlug}, ${categoryName}`,
      image: `https://crunchy-munch.com/assets/categories/${categorySlug}.jpg`
    });
  }
}