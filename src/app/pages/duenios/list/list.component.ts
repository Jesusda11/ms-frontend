
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Duenio } from 'src/app/models/duenio.model';
import { DueniosService } from 'src/app/services/duenios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-duenios-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  duenios: Duenio[] = [];

  constructor(private dueniosService: DueniosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.dueniosService.list().subscribe(data => {
      this.duenios = data;
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
        this.dueniosService.delete(id).subscribe(() => {
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
    this.router.navigate(["duenios/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["duenios/update",id]);
  }

  create(): void {
    this.router.navigate(["duenios/create"]);
  }

  
}
