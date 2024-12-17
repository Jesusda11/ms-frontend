
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servicio } from 'src/app/models/servicio.model';
import { ServiciosService } from 'src/app/services/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  servicios: Servicio[] = [];

  constructor(private serviciosService: ServiciosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.serviciosService.list().subscribe(data => {
      this.servicios = data;
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
        this.serviciosService.delete(id).subscribe(() => {
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
    this.router.navigate(["servicios/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["servicios/update",id]);
  }

  create(): void {
    this.router.navigate(["servicios/create"]);
  }

  
}
