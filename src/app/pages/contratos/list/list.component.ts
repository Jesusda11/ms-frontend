
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contratos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  contratos: Contrato[] = [];

  constructor(private contratosService: ContratosService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.contratosService.list().subscribe(data => {
      this.contratos = data;
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
        this.contratosService.delete(id).subscribe(() => {
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
    this.router.navigate(["contratos/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["contratos/update",id]);
  }

  create(): void {
    this.router.navigate(["contratos/create"]);
  }

  
}
