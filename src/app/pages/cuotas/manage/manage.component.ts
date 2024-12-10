
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuota } from 'src/app/models/cuota.model';
import { CuotasService } from 'src/app/services/cuotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  cuota:Cuota
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  // Es el que hace cumplir las reglas
  trySend:boolean  
  constructor(private  cuotasService:CuotasService, //
              private activateRoute:ActivatedRoute, //Me sirve para analizar la URL de la página, que quieren hacer en el momento
              private router:Router, //Me ayuda a gestionar los archivos del routing/moverme entre componentes
              private theFormBuilder:FormBuilder //congreso
  ) { 
    this.cuota={id: 0,contrato_id: 0,factura_id: 0,monto: 0,tasa_interes: 0,fecha_generacion: '',fecha_vencimiento: '',}
    this.mode=0
    this.trySend=false
    this.configFormGroup()
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/'); //Tome foto de L url 
    if (currentUrl.includes('view')) { 
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) { //Tomele foto necesito el id
      this.cuota.id = this.activateRoute.snapshot.params.id
      this.getCuota(this.cuota.id)
    }
  }

  configFormGroup(){
    this.theFormGroup=this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      //capacity:[0,[Validators.required,Validators.min(1),Validators.max(100)]], //La lista son las reglas para aplicar a dicho campo
    })
  }
  get getTheFormGroup(){
    return this.theFormGroup.controls
  } //Esto devuelve realmente una variable

  getCuota(id:number){
    this.cuotasService.view(id).subscribe(data =>{
      this.cuota = data
      this.cuota.fecha_generacion = this.cuota.fecha_generacion.split("T")[0]
this.cuota.fecha_vencimiento = this.cuota.fecha_vencimiento.split("T")[0]

    })
  }

  create(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.cuotasService.create(this.cuota).subscribe(data =>{
      Swal.fire("Creado", "Se ha creado exitosamente","success")
      this.router.navigate(["cuotas/list"])
    })
  }

  update(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.cuotasService.update(this.cuota).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["cuotas/list"])
    })
  }

}
