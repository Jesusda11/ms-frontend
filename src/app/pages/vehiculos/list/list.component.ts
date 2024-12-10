
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  vehiculos: Vehiculo[] = [];

  constructor(private vehiculosService: VehiculosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.vehiculosService.list().subscribe(data => {
      this.vehiculos = data;
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
        this.vehiculosService.delete(id).subscribe(() => {
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
    this.router.navigate(["vehiculos/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["vehiculos/update",id]);
  }

  create(): void {
    this.router.navigate(["vehiculos/create"]);
  }

  
}
