import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  lote_id: number;
  cliente_id: number;
  productos: Producto[];

  constructor(
    private productosService: ProductoService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.productos = [];
  }

  ngOnInit(): void {
    this.lote_id = this.route.snapshot.params['id'];
    this.cliente_id = this.route.snapshot.params['cliente_id'];  

    // Analiza la URL actual para decidir qué método ejecutar
    const currentUrl = this.route.snapshot.url.join('/');
    if (currentUrl.includes('showProducts')) {
      this.showProducts();
    } else if (currentUrl.includes('showProductos')) {
      this.showProductos(); 
    } else {
      this.list();
    }
  }

  list(): void {
    this.productosService.list().subscribe(data => {
      this.productos = data;
    });
  }

  delete(id: number): void {
    Swal.fire({
      title: "Eliminación",
      text: "Está seguro que quiere eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No,cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.delete(id).subscribe(() => {
          this.ngOnInit();
          Swal.fire({
            title: "Eliminado",
            text: "Se ha eliminado correctamente",
            icon: "success"
          });
        });
      }
    });
  }

  view(id: number): void {
    this.router.navigate(["productos/view", id]);
  }

  update(id: number): void {
    this.router.navigate(["productos/update", id]);
  }

  create(): void {
    this.router.navigate(["productos/create"]);
  }

  showProducts(): void {
    this.productosService.listBylot(this.lote_id).subscribe(data => {
      this.productos = data;
      console.log(this.productos);
    });
  }

  showProductos(): void {
    this.productosService.listByClient(this.cliente_id).subscribe(data => {
      this.productos = data;
      console.log(this.productos);
    });
  }
}
