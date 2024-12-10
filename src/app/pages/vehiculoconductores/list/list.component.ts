
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vehiculoconductor } from 'src/app/models/vehiculoconductor.model';
import { VehiculoconductoresService } from 'src/app/services/vehiculoconductores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculoconductores-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  vehiculoconductores: Vehiculoconductor[] = [];

  constructor(private vehiculoconductoresService: VehiculoconductoresService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.vehiculoconductoresService.list().subscribe(data => {
      this.vehiculoconductores = data;
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
        this.vehiculoconductoresService.delete(id).subscribe(() => {
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
    this.router.navigate(["vehiculoconductores/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["vehiculoconductores/update",id]);
  }

  create(): void {
    this.router.navigate(["vehiculoconductores/create"]);
  }

  
}
