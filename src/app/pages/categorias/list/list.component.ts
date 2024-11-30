import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  categorias:Categoria[];
  constructor(private categoriasService:CategoriaService, private router: Router) {
    this.categorias=[]
  }

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.categoriasService.list().subscribe(data=> {
      this.categorias=data
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
        this.categoriasService.delete(id).subscribe(data => {
          this.ngOnInit
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
    this.router.navigate(["categorias/view",id])
  }

  update(id:number){
    this.router.navigate(["categorias/update", id])
  }

  create(){
    this.router.navigate(["categorias/create"])
  }

}
