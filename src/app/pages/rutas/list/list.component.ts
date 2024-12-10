
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ruta } from 'src/app/models/ruta.model';
import { RutasService } from 'src/app/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  rutas: Ruta[] = [];

  constructor(private rutasService: RutasService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.rutasService.list().subscribe(data => {
      this.rutas = data;
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
        this.rutasService.delete(id).subscribe(() => {
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
    this.router.navigate(["rutas/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["rutas/update",id]);
  }

  create(): void {
    this.router.navigate(["rutas/create"]);
  }

  
}
