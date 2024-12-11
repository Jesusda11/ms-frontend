
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gasto } from 'src/app/models/gasto.model';
import { GastosService } from 'src/app/services/gastos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gastos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  gastos: Gasto[] = [];

  constructor(private gastosService: GastosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.gastosService.list().subscribe(data => {
      this.gastos = data;
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
        this.gastosService.delete(id).subscribe(() => {
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
    this.router.navigate(["gastos/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["gastos/update",id]);
  }

  create(): void {
    this.router.navigate(["gastos/create"]);
  }

  
}
