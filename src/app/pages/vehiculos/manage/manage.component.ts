import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  vehiculo: Vehiculo;
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private vehiculosService: VehiculosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.vehiculo = { id: 0, matricula: '', modelo: '', capacidad: '', tipo_carga: '', longitud: 0, latitud: 0 };
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
      this.vehiculo.id = this.activateRoute.snapshot.params.id;
      this.getVehiculo(this.vehiculo.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      matricula: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,8}$/)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      capacidad: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      tipo_carga: ['', [Validators.required, Validators.minLength(3)]],
      longitud: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      latitud: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getVehiculo(id: number) {
    this.vehiculosService.view(id).subscribe(data => {
      this.vehiculo = data;
      this.theFormGroup.patchValue(this.vehiculo);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const vehiculoData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.vehiculosService.create(vehiculoData).subscribe(() => {
        Swal.fire('Creado', 'Se ha creado exitosamente', 'success');
        this.router.navigate(['vehiculos/list']);
      });
    } else if (this.mode === 3) {
      this.vehiculosService.update(vehiculoData).subscribe(() => {
        Swal.fire('Actualizado', 'Se ha actualizado exitosamente', 'success');
        this.router.navigate(['vehiculos/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('matricula')?.errors) {
        this.showFieldError('Campo Matrícula', 'La matrícula es obligatoria y debe tener entre 6 y 8 caracteres alfanuméricos.');
        return false;
      }

      if (this.theFormGroup.get('modelo')?.errors) {
        this.showFieldError('Campo Modelo', 'El modelo es obligatorio y debe tener al menos 2 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('capacidad')?.errors) {
        this.showFieldError('Campo Capacidad', 'La capacidad es obligatoria y debe estar entre 1 y 100.');
        return false;
      }

      if (this.theFormGroup.get('tipo_carga')?.errors) {
        this.showFieldError('Campo Tipo de Carga', 'El tipo de carga es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('longitud')?.errors) {
        this.showFieldError('Campo Longitud', 'La longitud debe estar entre -180 y 180.');
        return false;
      }

      if (this.theFormGroup.get('latitud')?.errors) {
        this.showFieldError('Campo Latitud', 'La latitud debe estar entre -90 y 90.');
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
      text: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}
