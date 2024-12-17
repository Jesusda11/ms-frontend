
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Direccionruta } from 'src/app/models/direccionruta.model';
import { DireccionrutasService } from 'src/app/services/direccionrutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-direccionrutas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  direccionrutas: Direccionruta[] = [];

  constructor(private direccionrutasService: DireccionrutasService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.direccionrutasService.list().subscribe(data => {
      this.direccionrutas = data;
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
        this.direccionrutasService.delete(id).subscribe(() => {
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
    this.router.navigate(["direccionrutas/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["direccionrutas/update",id]);
  }

  create(): void {
    this.router.navigate(["direccionrutas/create"]);
  }

  
}
