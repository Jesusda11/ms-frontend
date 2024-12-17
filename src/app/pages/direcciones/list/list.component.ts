
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Direccion } from 'src/app/models/direccion.model';
import { DireccionesService } from 'src/app/services/direcciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-direcciones-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  direcciones: Direccion[] = [];

  constructor(private direccionesService: DireccionesService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.direccionesService.list().subscribe(data => {
      this.direcciones = data;
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
        this.direccionesService.delete(id).subscribe(() => {
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
    this.router.navigate(["direcciones/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["direcciones/update",id]);
  }

  create(): void {
    this.router.navigate(["direcciones/create"]);
  }

  
}
