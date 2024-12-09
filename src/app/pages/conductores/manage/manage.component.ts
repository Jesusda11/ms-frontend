import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Conductor } from 'src/app/models/conductor.model';
import { ConductorService } from 'src/app/services/conductor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  conductor:Conductor
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  // Es el que hace cumplir las reglas
  trySend:boolean  
  constructor(private conductorsService:ConductorService, //
              private activateRoute:ActivatedRoute, //Me sirve para analizar la URL de la página, que quieren hacer en el momento
              private router:Router, //Me ayuda a gestionar los archivos del routing/moverme entre componentes
              private theFormBuilder:FormBuilder //congreso
  ) { 
    this.conductor={id:0,usuario_id:"",licencia_conduccion:"",anios_experiencia:0}
    this.mode=0
    this.trySend=false
    //this.configFormGroup()
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
      this.conductor.id = this.activateRoute.snapshot.params.id
      this.getConductor(this.conductor.id)
    }
  }

  /*configFormGroup(){
    this.theFormGroup=this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      capacity:[0,[Validators.required,Validators.min(1),Validators.max(100)]], //La lista son las reglas para aplicar a dicho campo
      location:['',[Validators.required,Validators.minLength(2)]]  
    })
  }*/
  get getTheFormGroup(){
    return this.theFormGroup.controls
  } //Esto devuelve realmente una variable

  getConductor(id:number){
    this.conductorsService.view(id).subscribe(data =>{
      this.conductor = data
    })
  }

  create(){
    /*if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }*/
    this.conductorsService.create(this.conductor).subscribe(data =>{
      Swal.fire("Creado", "Se ha creado exitosamente","success")
      this.router.navigate(["conductores/list"])
    })
  }

  update(){
    /*if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }*/
    this.conductorsService.update(this.conductor).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["conductores/list"])
    })
  }

}
