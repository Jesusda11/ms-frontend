
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dueniovehiculo } from 'src/app/models/dueniovehiculo.model';
import { DueniovehiculosService } from 'src/app/services/dueniovehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dueniovehiculos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  dueniovehiculos: Dueniovehiculo[] = [];

  constructor(private dueniovehiculosService: DueniovehiculosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.dueniovehiculosService.list().subscribe(data => {
      this.dueniovehiculos = data;
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
        this.dueniovehiculosService.delete(id).subscribe(() => {
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
    this.router.navigate(["dueniovehiculos/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["dueniovehiculos/update",id]);
  }

  create(): void {
    this.router.navigate(["dueniovehiculos/create"]);
  }

  
}
