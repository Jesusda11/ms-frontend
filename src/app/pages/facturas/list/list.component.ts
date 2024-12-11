
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Factura } from 'src/app/models/factura.model';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  facturas: Factura[] = [];

  constructor(private facturasService: FacturasService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.facturasService.list().subscribe(data => {
      this.facturas = data;
    });
  }

  delete(id: number): void {
    Swal.fire({
      title: "Eliminación",
      text: "Está seguro que quiere eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturasService.delete(id).subscribe(() => {
          this.ngOnInit()
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
    this.router.navigate(["facturas/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["facturas/update",id]);
  }

  create(): void {
    this.router.navigate(["facturas/create"]);
  }

  
}
