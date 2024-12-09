import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Conductor } from 'src/app/models/conductor.model';
import { ConductorService } from 'src/app/services/conductor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  conductores:Conductor[];
  constructor(private conductoresService:ConductorService, private router: Router) {
    this.conductores=[]
  }

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.conductoresService.list().subscribe(data=> {
      this.conductores=data
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
        this.conductoresService.delete(id).subscribe(data => {
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
    this.router.navigate(["conductores/view",id])
  }

  update(id:number){
    this.router.navigate(["conductores/update", id])
  }

  create(){
    this.router.navigate(["conductores/create"])
  }

}
