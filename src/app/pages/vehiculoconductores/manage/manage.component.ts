import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Conductor } from 'src/app/models/conductor.model';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { Vehiculoconductor } from 'src/app/models/vehiculoconductor.model';
import { ConductorService } from 'src/app/services/conductor.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { VehiculoconductoresService } from 'src/app/services/vehiculoconductores.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  vehiculoconductor: Vehiculoconductor;
  mode: number;
  vehiculos: Vehiculo[] = [];
  conductores: Conductor[] = [];
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private vehiculoconductoresService: VehiculoconductoresService,
    private conductoresService: ConductorService,
    private vehiculosService: VehiculosService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.vehiculoconductor = { id: 0, vehiculo_id: 0, conductor_id: 0 };
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
      this.vehiculoconductor.id = this.activateRoute.snapshot.params.id;
      this.getVehiculoconductor(this.vehiculoconductor.id);
    }

    this.conductoresService.list().subscribe(data => {
      this.conductores = data;
      this.conductores.forEach(conductor => {
        this.usuariosService.view(conductor.usuario_id).subscribe(usuario => {
          conductor.usuario_name = usuario.name;
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
      vehiculo_id: ['', [Validators.required]],
      conductor_id: ['', [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getVehiculoconductor(id: number) {
    this.vehiculoconductoresService.view(id).subscribe(data => {
      this.vehiculoconductor = data;
      this.theFormGroup.patchValue(this.vehiculoconductor);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.vehiculoconductoresService.create(serviceData).subscribe(() => {
        Swal.fire('Creado', 'Se ha creado exitosamente', 'success');
        this.router.navigate(['vehiculoconductores/list']);
      });
    } else if (this.mode === 3) {
      this.vehiculoconductoresService.update(serviceData).subscribe(() => {
        Swal.fire('Actualizado', 'Se ha actualizado exitosamente', 'success');
        this.router.navigate(['vehiculoconductores/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('vehiculo_id')?.errors) {
        this.showFieldError('Campo Vehículo', 'El vehículo es obligatorio.');
        return false;
      }

      if (this.theFormGroup.get('conductor_id')?.errors) {
        this.showFieldError('Campo Conductor', 'El conductor es obligatorio.');
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
}
