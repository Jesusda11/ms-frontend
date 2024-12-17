
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Personanatural } from 'src/app/models/personanatural.model';
import { PersonanaturalesService } from 'src/app/services/personanaturales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personanaturales-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  personanaturales: Personanatural[] = [];

  constructor(private personanaturalesService: PersonanaturalesService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.personanaturalesService.list().subscribe(data => {
      this.personanaturales = data;
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
        this.personanaturalesService.delete(id).subscribe(() => {
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
    this.router.navigate(["personanaturales/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["personanaturales/update",id]);
  }

  create(): void {
    this.router.navigate(["personanaturales/create"]);
  }

  
}
