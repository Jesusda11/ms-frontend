import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { Ruta } from 'src/app/models/ruta.model';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { RutasService } from 'src/app/services/rutas.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  ruta: Ruta;
  contratos: Contrato[] = []
  vehiculos: Vehiculo[] = []
  mode: number; // 1: view, 2: create, 3: update
  theFormGroup: FormGroup; // FormGroup para validaciones
  trySend: boolean; // Para mostrar errores cuando se intenta enviar el formulario sin éxito

  constructor(
    private rutasService: RutasService,
    private vehiculosService: VehiculosService,
    private contratosService: ContratosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.ruta = { id: 0, contrato_id: 0, vehiculo_id: 0, lugar_inicio: '', lugar_fin: '', distancia: 0 };
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.theFormGroup.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.ruta.id = this.activateRoute.snapshot.params.id;
      this.getRuta(this.ruta.id);
    }

    this.contratosService.list().subscribe(data => {
      this.contratos = data;
    });

    this.vehiculosService.list().subscribe(data => {
      this.vehiculos = data;
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      contrato_id: [0, [Validators.required, Validators.min(1)]],
      vehiculo_id: [0, [Validators.required, Validators.min(1)]],
      lugar_inicio: ['', [Validators.required, Validators.minLength(3)]],
      lugar_fin: ['', [Validators.required, Validators.minLength(3)]],
      distancia: [0, [Validators.required, Validators.min(1)]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getRuta(id: number) {
    this.rutasService.view(id).subscribe(data => {
      this.ruta = data;
      this.theFormGroup.patchValue(this.ruta);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.rutasService.create(serviceData).subscribe(() => {
        Swal.fire('Creado', 'La ruta se ha creado exitosamente', 'success');
        this.router.navigate(['rutas/list']);
      });
    } else if (this.mode === 3) {
      this.rutasService.update(serviceData).subscribe(() => {
        Swal.fire('Actualizado', 'La ruta se ha actualizado exitosamente', 'success');
        this.router.navigate(['rutas/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('contrato_id')?.errors) {
        this.showFieldError('Contrato ID', 'El contrato ID es obligatorio y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('vehiculo_id')?.errors) {
        this.showFieldError('Vehículo ID', 'El vehículo ID es obligatorio y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('lugar_inicio')?.errors) {
        this.showFieldError('Lugar de Inicio', 'El lugar de inicio es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('lugar_fin')?.errors) {
        this.showFieldError('Lugar de Fin', 'El lugar de fin es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('distancia')?.errors) {
        this.showFieldError('Distancia', 'La distancia es obligatoria y debe ser mayor a 0.');
        return false;
      }

      Swal.fire('Error en el formulario', 'Corrige los errores antes de continuar.', 'error');
      return false;
    }

    return true;
  }

  private showFieldError(title: string, message: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      html: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  showlots(id:number){
    this.router.navigate(["lotes/filterByRoute", + id])
  }

}
