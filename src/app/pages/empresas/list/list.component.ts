import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  empresas:Empresa[];
  constructor(private empresasService:EmpresaService, private router: Router) {
    this.empresas=[]
  }

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.empresasService.list().subscribe(data=> {
      this.empresas=data
    })
  }

  delete(id: number) {
    Swal.fire({
      title: "Eliminación",
      text: "Está seguro que quiere eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No,cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresasService.delete(id).subscribe(data => {
          this.ngOnInit()
          Swal.fire({
            title: "Eliminado",
            text: "Se ha eliminado correctamente",
            icon: "success"
          });
        })

      }
    });
  }
  
  view(id:number){
    this.router.navigate(["empresas/view",id])
  }

  update(id:number){
    this.router.navigate(["empresas/update", id])
  }

  create(){
    this.router.navigate(["empresas/create"])
  }

}
