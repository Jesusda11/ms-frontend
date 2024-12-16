
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuota } from 'src/app/models/cuota.model';
import { CuotasService } from 'src/app/services/cuotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuotas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  contrato_id:number
  cuotas: Cuota[] = [];

  constructor(private cuotasService: CuotasService, private router: Router, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.contrato_id = this.route.snapshot.params['id'];

    const currentUrl = this.route.snapshot.url.join('/');
    if (currentUrl.includes('filter')) {
      this.filter();
    } else {
      this.list();
    }  

  }

  list(): void {
    this.cuotasService.list().subscribe(data => {
      this.cuotas = data;
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
        this.cuotasService.delete(id).subscribe(() => {
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
    this.router.navigate(["cuotas/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["cuotas/update",id]);
  }

  create(): void {
    this.router.navigate(["cuotas/create"]);
  }

  filter(): void{
    this.cuotasService.listByContract(this.contrato_id).subscribe(data => {
      this.cuotas = data;
      console.log(this.cuotas)
    });
  }
}
