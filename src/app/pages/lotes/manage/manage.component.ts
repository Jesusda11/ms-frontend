import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { Lote } from 'src/app/models/lote.model';
import { LoteService } from 'src/app/services/lote.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  lote:Lote
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  
  trySend:boolean  
  constructor(private lotesService:LoteService,
              private activateRoute:ActivatedRoute, 
              private router:Router, 
              private theFormBuilder:FormBuilder
  ) { 
    this.lote={id:0,tipoDeCarga:"", peso:0, ruta_id:0}
    this.mode=0
    this.trySend=false
    //this.configFormGroup()
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/'); 
    if (currentUrl.includes('view')) { 
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) { 
      this.lote.id = this.activateRoute.snapshot.params.id
      this.getLote(this.lote.id)
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
  } 

  getLote(id:number){
    this.lotesService.view(id).subscribe(data =>{
      this.lote = data
    })
  }

  create(){
    /*if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }*/
  
    this.lotesService.create(this.lote).subscribe(data =>{
      Swal.fire("Creado", "Se ha creado exitosamente","success")
      this.router.navigate(["lotes/list"])
    })
  }

  update(){
    /*if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }*/
    this.lotesService.update(this.lote).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["lotes/list"])
    })
  }

}
