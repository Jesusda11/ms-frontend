import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  productos:Producto[];
  constructor(private productosService:ProductoService, private router: Router) {
    this.productos=[]
  }

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.productosService.list().subscribe(data=> {
      this.productos=data
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
        this.productosService.delete(id).subscribe(data => {
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
    this.router.navigate(["productos/view",id])
  }

  update(id:number){
    this.router.navigate(["productos/update", id])
  }

  create(){
    this.router.navigate(["productos/create"])
  }

}
