import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Duenio } from 'src/app/models/duenio.model';
import { Dueniovehiculo } from 'src/app/models/dueniovehiculo.model';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { DueniosService } from 'src/app/services/duenios.service';
import { DueniovehiculosService } from 'src/app/services/dueniovehiculos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  dueniovehiculo: Dueniovehiculo;
  duenios: Duenio[] = []
  vehiculos: Vehiculo[] = []
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private dueniovehiculosService: DueniovehiculosService,
    private activateRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private dueniosService: DueniosService,
    private vehiculosService: VehiculosService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.dueniovehiculo = { id: 0, vehiculo_id: 0, duenio_id: 0, fecha_compra: '' };
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
      this.dueniovehiculo.id = this.activateRoute.snapshot.params.id;
      this.getDueniovehiculo(this.dueniovehiculo.id);
    }

    this.dueniosService.list().subscribe(data => {
      this.duenios = data;
      this.duenios.forEach(duenio => {
        this.usuariosService.view(duenio.usuario_id).subscribe(usuario => {
          duenio.usuario_name = usuario.name;
        });
      });
    });

    this.vehiculosService.list().subscribe(data => {
      this.vehiculos = data;
    });

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      vehiculo_id: [0, [Validators.required, Validators.min(1)]],
      duenio_id: [0, [Validators.required, Validators.min(1)]],
      fecha_compra: ['', [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDueniovehiculo(id: number) {
    this.dueniovehiculosService.view(id).subscribe(data => {
      this.dueniovehiculo = data;
      this.dueniovehiculo.fecha_compra = this.dueniovehiculo.fecha_compra.split("T")[0];
      this.theFormGroup.patchValue(this.dueniovehiculo);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.dueniovehiculosService.create(serviceData).subscribe(() => {
        Swal.fire("Creado", "Registro creado exitosamente", "success");
        this.router.navigate(["dueniovehiculos/list"]);
      });
    } else if (this.mode === 3) {
      this.dueniovehiculosService.update(serviceData).subscribe(() => {
        Swal.fire("Actualizado", "Registro actualizado exitosamente", "success");
        this.router.navigate(["dueniovehiculos/list"]);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('vehiculo_id')?.errors) {
        this.showFieldError('Campo Vehículo', 'El ID del vehículo es obligatorio y debe ser mayor que 0.');
        return false;
      }

      if (this.theFormGroup.get('duenio_id')?.errors) {
        this.showFieldError('Campo Dueño', 'El ID del dueño es obligatorio y debe ser mayor que 0.');
        return false;
      }

      if (this.theFormGroup.get('fecha_compra')?.errors) {
        this.showFieldError('Campo Fecha de Compra', 'La fecha de compra es obligatoria.');
        return false;
      }

      Swal.fire('Error en el formulario', 'Corrige los errores antes de continuar.', 'error');
      return false;
    }

    return true;
  }

  private showFieldError(title: string, message: string) {
    Swal.fire({
      icon: "warning",
      title: title,
      html: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}
