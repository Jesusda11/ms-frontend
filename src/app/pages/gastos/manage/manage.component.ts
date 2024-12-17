import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

import { Conductor } from 'src/app/models/conductor.model';
import { Duenio } from 'src/app/models/duenio.model';
import { Factura } from 'src/app/models/factura.model';
import { Gasto } from 'src/app/models/gasto.model';
import { Servicio } from 'src/app/models/servicio.model';
import { ConductorService } from 'src/app/services/conductor.service';
import { DueniosService } from 'src/app/services/duenios.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { GastosService } from 'src/app/services/gastos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { log } from 'node:console';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  gasto: Gasto = { costo: 0, servicio_id: 0, conductor_id: 0, duenios_id: 0, factura_id: 0, id: 0 };
  servicios: Servicio[] = [];
  conductores: Conductor[] = [];
  duenios: Duenio[] = [];
  facturas: Factura[] = [];
  mode: number = 0; // 1: view, 2: create, 3: update
  theFormGroup: FormGroup;
  trySend: boolean = false;

  constructor(
    private gastosService: GastosService,
    private serviciosService: ServiciosService,
    private conductoresService: ConductorService,
    private usuariosService: UsuariosService,
    private dueniosService: DueniosService,
    private facturasService: FacturasService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.setupMode();
    this.loadData();
    this.getGasto(this.gasto.id);
  }

  private setupMode(): void {
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
      this.gasto.id = this.activateRoute.snapshot.params.id;
    }
  }

  private loadData(): void {
    forkJoin({
      servicios: this.serviciosService.list(),
      conductores: this.conductoresService.list(),
      duenios: this.dueniosService.list(),
      facturas: this.facturasService.list(),
    }).subscribe(({ servicios, conductores, duenios, facturas }) => {
      this.servicios = servicios;
      this.conductores = conductores.map((conductor) => {
        this.usuariosService.view(conductor.usuario_id).subscribe((usuario) => {
          conductor.usuario_name = usuario.name;
        });
        return conductor;
      });
      this.duenios = duenios.map((duenio) => {
        this.usuariosService.view(duenio.usuario_id).subscribe((usuario) => {
          duenio.usuario_name = usuario.name;
        });
        return duenio
      });

      console.log("duenios:", duenios);
      
      this.facturas = facturas;

      
    });
  }

  private configFormGroup(): void {
    this.theFormGroup = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      costo: [0, [Validators.required, Validators.min(0)]],
      servicio_id: [0, [Validators.required, Validators.min(1)]],
      conductor_id: [0, [Validators.required, Validators.min(1)]],
      duenios_id: [0, [Validators.required, Validators.min(1)]],
      factura_id: [null]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  private getGasto(id: number): void {
    this.gastosService.view(id).subscribe((data) => {
      this.gasto = data;
      this.theFormGroup.patchValue(this.gasto);
    });
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    const formData = this.theFormGroup.getRawValue();

    const operation =
      this.mode === 2
        ? this.gastosService.create(formData)
        : this.gastosService.update(formData);

    operation.subscribe(
      () => {
        const action = this.mode === 2 ? 'Creado' : 'Actualizado';
        this.showSuccess(action, `El gasto se ha ${action.toLowerCase()} exitosamente.`);
      },
      (error) => this.showError('Error al procesar', error.message)
    );
  }

  private validateForm(): boolean {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      const errors = Object.entries(this.theFormGroup.controls)
        .filter(([_, control]) => control.errors)
        .map(([key]) => `El campo ${key} es inválido.`);

      Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        html: `<ul>${errors.map((err) => `<li>${err}</li>`).join('')}</ul>`,
      });
      return false;
    }

    return true;
  }

  private showSuccess(title: string, message: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
    }).then(() => {
      this.router.navigate(['gastos/list']);
    });
  }

  private showError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }
}
