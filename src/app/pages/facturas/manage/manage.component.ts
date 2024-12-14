
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura.model';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @ViewChild('fechaInput') fechaInput!: ElementRef;
  @ViewChild('totalInput') totalInput!: ElementRef;
  @ViewChild('estadoInput') estadoInput!: ElementRef;

  factura:Factura
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  // Es el que hace cumplir las reglas
  trySend:boolean  
  constructor(private  facturasService:FacturasService, //
              private activateRoute:ActivatedRoute, //Me sirve para analizar la URL de la página, que quieren hacer en el momento
              private router:Router, //Me ayuda a gestionar los archivos del routing/moverme entre componentes
              private theFormBuilder:FormBuilder //congreso
  ) { 
    this.factura={fecha: '',total: 0,estado: '',id: 0,}
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
      this.factura.id = this.activateRoute.snapshot.params.id
      this.getFactura(this.factura.id)
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      fecha: ['', Validators.required], // Fecha obligatoria
      total: [0, [Validators.required, Validators.min(0)]], // Total debe ser >= 0
      estado: ['', [Validators.required]]// Estado requerido
    });
  }
  
  get getTheFormGroup(){
    return this.theFormGroup.controls
  } //Esto devuelve realmente una variable

  getFactura(id:number){
    this.facturasService.view(id).subscribe(data =>{
      this.factura = data
      this.factura.fecha = this.factura.fecha.split("T")[0]
      this.theFormGroup.patchValue(this.factura);
    })
  }

  create() {
    this.trySend=false
    // Verificar si el formulario es inválido
    if (this.theFormGroup.invalid) {
      this.trySend = true;
  
      if (this.theFormGroup.get('fecha')?.errors) {
        this.showFieldError('fecha', 'Campo fecha', 'Ingresa una fecha 📅', this.fechaInput);
        return;
      }

      if (this.theFormGroup.get('total')?.errors) {

        if(this.theFormGroup.get('total')?.errors?.['required']){
          this.showFieldError('total', 'Campo Total', 'Ingresa un total 💸', this.totalInput); // Enfoca el input de total
        }else if(this.theFormGroup.get('total')?.errors?.['min']){
          this.showFieldError('total', 'Campo Total', 'valor minimo es 0 💸', this.totalInput); // Enfoca el input de total
        }
        
        return; 
      }
  
      if (this.theFormGroup.get('estado')?.errors) {
        this.showFieldError('estado', 'Campo Estado', 'Ingresa un estado', this.estadoInput);
        return; 
      }
      // Mostrar un error genérico si hay errores que no fueron específicos
      Swal.fire('Error en el formulario', 'Corrige los errores antes de continuar.', 'error');
      return;
    }
  
    const factura = this.theFormGroup.value; // Obtiene valores del FormGroup
    this.facturasService.create(factura).subscribe(data => {
      Swal.fire("Creado", "Se ha creado exitosamente", "success");
      this.router.navigate(["facturas/list"]);
    });
  }
  

  private showFieldError(
    fieldName: string,
    title: string,
    message: string,
    inputRef: ElementRef
  ) {
    let timerInterval;
    Swal.fire({
      icon: "warning",
      title: title,
      html: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then(() => {
      // Usar un setTimeout para garantizar el foco correcto después de cerrar la alerta
      setTimeout(() => {
        inputRef.nativeElement.focus();
      }, 500); // Ajusta el tiempo si es necesario
    });
  }  

  update(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.facturasService.update(this.factura).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["facturas/list"])
    })
  }

}
