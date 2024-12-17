
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Administrador } from 'src/app/models/administrador.model';
import { AdministradoresService } from 'src/app/services/administradores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administradores-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  administradores: Administrador[] = [];

  constructor(private administradoresService: AdministradoresService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.administradoresService.list().subscribe(data => {
      console.log(data);
      this.administradores = data;
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
        this.administradoresService.delete(id).subscribe(() => {
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
    this.router.navigate(["administradores/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["administradores/update",id]);
  }

  create(): void {
    this.router.navigate(["administradores/create"]);
  }

  
}
