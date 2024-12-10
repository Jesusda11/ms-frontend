
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/models/turno.model';
import { TurnosService } from 'src/app/services/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  turnos: Turno[] = [];

  constructor(private turnosService: TurnosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.turnosService.list().subscribe(data => {
      this.turnos = data;
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
        this.turnosService.delete(id).subscribe(() => {
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
    this.router.navigate(["turnos/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["turnos/update",id]);
  }

  create(): void {
    this.router.navigate(["turnos/create"]);
  }

  
}
