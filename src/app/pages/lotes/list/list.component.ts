import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lote } from 'src/app/models/lote.model';
import { LoteService } from 'src/app/services/lote.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  ruta_id:number
  lotes:Lote[];
  constructor(private lotesService:LoteService, private router: Router, private route: ActivatedRoute) {
    this.lotes=[]
  }

  ngOnInit(): void {
    this.ruta_id = this.route.snapshot.params['id'];

    const currentUrl = this.route.snapshot.url.join('/');
    if (currentUrl.includes('filterByRoute')) {
      this.filterByRoute();
    } else {
      this.list();
    }  
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

  filterByRoute(): void{
    this.lotesService.listByRoute(this.ruta_id).subscribe(data => {
      this.lotes = data;
      console.log(this.lotes);
    });
  }

}
