
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccionruta } from 'src/app/models/direccionruta.model';
import { DireccionrutasService } from 'src/app/services/direccionrutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  direccionruta:Direccionruta
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  // Es el que hace cumplir las reglas
  trySend:boolean  
  constructor(private  direccionrutasService:DireccionrutasService, //
              private activateRoute:ActivatedRoute, //Me sirve para analizar la URL de la página, que quieren hacer en el momento
              private router:Router, //Me ayuda a gestionar los archivos del routing/moverme entre componentes
              private theFormBuilder:FormBuilder //congreso
  ) { 
    this.direccionruta={direccion_id: 0,ruta_id: 0,lote_id: 0,fechaEntrega: '',distancia: 0,estado: '',ordenDePaso: 0,id: 0,}
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
      this.direccionruta.id = this.activateRoute.snapshot.params.id
      this.getDireccionruta(this.direccionruta.id)
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

  getDireccionruta(id:number){
    this.direccionrutasService.view(id).subscribe(data =>{
      this.direccionruta = data
      this.direccionruta.fecha_entrega = this.direccionruta.fecha_entrega.split("T")[0]

    })
  }

  create(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.direccionrutasService.create(this.direccionruta).subscribe(data =>{
      Swal.fire("Creado", "Se ha creado exitosamente","success")
      this.router.navigate(["direccionrutas/list"])
    })
  }

  update(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.direccionrutasService.update(this.direccionruta).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["direccionrutas/list"])
    })
  }

}
