import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Theater } from 'src/app/models/theater.model';
import { TheaterService } from 'src/app/services/theater.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  theaters:Theater[];
  constructor(private theatersService:TheaterService, private router: Router) {
    
    this.theaters= []
  }

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.theatersService.list().subscribe(data=> { // Para llamar a la API 
      this.theaters=data
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
        this.theatersService.delete(id).subscribe(data => {
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
    this.router.navigate(["theaters/view",id])
  }

  update(id:number){
    this.router.navigate(["theaters/update", id])
  }

  create(){
    this.router.navigate(["theaters/create"])
  }
}
