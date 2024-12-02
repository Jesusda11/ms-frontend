import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lote } from 'src/app/models/lote.model';
import { LoteService } from 'src/app/services/lote.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  lotes:Lote[];
  constructor(private lotesService:LoteService, private router: Router) {
    this.lotes=[]
  }

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.lotesService.list().subscribe(data=> {
      this.lotes=data
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
        this.lotesService.delete(id).subscribe(data => {
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
    this.router.navigate(["lotes/view",id])
  }

  update(id:number){
    this.router.navigate(["lotes/update", id])
  }

  create(){
    this.router.navigate(["lotes/create"])
  }

}
