import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  categoria:Categoria
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  
  trySend:boolean  
  constructor(private categoriasService:CategoriaService,
              private activateRoute:ActivatedRoute, 
              private router:Router, 
              private theFormBuilder:FormBuilder
  ) { 
    this.categoria={id:0,nombre:"",descripcion:""}
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
      this.categoria.id = this.activateRoute.snapshot.params.id
      this.getCategoria(this.categoria.id)
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

  getCategoria(id:number){
    this.categoriasService.view(id).subscribe(data =>{
      this.categoria = data
    })
  }

  create(){
    /*if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }*/
    this.categoriasService.create(this.categoria).subscribe(data =>{
      Swal.fire("Creado", "Se ha creado exitosamente","success")
      this.router.navigate(["categorias/list"])
    })
  }

  update(){
    /*if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }*/
    this.categoriasService.update(this.categoria).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["categorias/list"])
    })
  }

}
