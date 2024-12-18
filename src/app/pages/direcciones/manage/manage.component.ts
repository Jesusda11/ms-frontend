import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion } from 'src/app/models/direccion.model';
import { DireccionesService } from 'src/app/services/direcciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  direccion: Direccion;
  mode: number; // 1 --> view, 2 --> create, 3 --> update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private direccionesService: DireccionesService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.direccion = { barrio: '', tipo_calle: '', calle: '', numero: 0, piso: '', municipio_id: 0, id: 0 };
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.theFormGroup.disable(); // Disable form for view mode
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      this.direccion.id = this.activateRoute.snapshot.params.id;
      this.getDireccion(this.direccion.id);
    }
  }

  configFormGroup(): void {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      barrio: ['', [Validators.required, Validators.minLength(3)]],
      tipo_calle: ['', [Validators.required]],
      calle: ['', [Validators.required, Validators.minLength(3)]],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Ensure it's a number
      piso: ['', [Validators.required, Validators.minLength(1)]],
      municipio_id: [1, [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDireccion(id: number): void {
    this.direccionesService.view(id).subscribe(data => {
      this.direccion = data;
      this.theFormGroup.patchValue(this.direccion);
    });
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.direccionesService.create(serviceData).subscribe(() => {
        Swal.fire('Creado', 'Se ha creado exitosamente', 'success');
        this.router.navigate(['direcciones/list']);
      });
    } else if (this.mode === 3) {
      this.direccionesService.update(serviceData).subscribe(() => {
        Swal.fire('Actualizado', 'Se ha actualizado exitosamente', 'success');
        this.router.navigate(['direcciones/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('barrio')?.errors) {
        this.showFieldError('Campo Barrio', 'El barrio es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('tipo_calle')?.errors) {
        this.showFieldError('Campo Tipo de Calle', 'El tipo de calle es obligatorio.');
        return false;
      }

      if (this.theFormGroup.get('calle')?.errors) {
        this.showFieldError('Campo Calle', 'La calle es obligatoria y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('numero')?.errors) {
        this.showFieldError('Campo Número', 'El número es obligatorio y debe ser un número válido.');
        return false;
      }

      if (this.theFormGroup.get('piso')?.errors) {
        this.showFieldError('Campo Piso', 'El piso es obligatorio y debe tener al menos 1 carácter.');
        return false;
      }

      if (this.theFormGroup.get('municipio_id')?.errors) {
        this.showFieldError('Campo Municipio', 'Selecciona un municipio válido.');
        return false;
      }

      // Error genérico
      Swal.fire('Error en el formulario', 'Corrige los errores antes de continuar.', 'error');
      return false;
    }

    return true;
  }

  private showFieldError(title: string, message: string): void {
    Swal.fire({
      icon: 'warning',
      title: title,
      html: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}
