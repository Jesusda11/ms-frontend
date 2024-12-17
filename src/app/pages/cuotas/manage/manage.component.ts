import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { Cuota } from 'src/app/models/cuota.model';
import { Factura } from 'src/app/models/factura.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { CuotasService } from 'src/app/services/cuotas.service';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  cuota: Cuota;
  mode: number; // mode=1 --> view, mode=2 --> create, mode=3 --> update
  contratos: Contrato[] =[]
  facturas: Factura[] =[]
  theFormGroup: FormGroup; // El que hace cumplir las reglas
  trySend: boolean;

  constructor(
    private cuotasService: CuotasService,
    private activateRoute: ActivatedRoute,
    private contratosService: ContratosService,
    private facturasService: FacturasService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) { 
    this.cuota = { id: 0, contrato_id: 0, factura_id: 0, monto: 0, tasa_interes: 0, fecha_generacion: '', fecha_vencimiento: '' };
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
      this.cuota.id = this.activateRoute.snapshot.params.id;
      this.getCuota(this.cuota.id);
    }

    this.contratosService.list().subscribe(data => {
      this.contratos = data;
    });

    this.facturasService.list().subscribe(data => {
      this.facturas = data;
    });

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      contrato_id: ['', [Validators.required]],
      factura_id: ['', [Validators.required]],
      monto: [0, [Validators.required, Validators.min(1)]],
      tasa_interes: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      fecha_generacion: ['', [Validators.required]],
      fecha_vencimiento: ['', [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getCuota(id: number) {
    this.cuotasService.view(id).subscribe(data => {
      this.cuota = data;
      this.cuota.fecha_generacion = this.cuota.fecha_generacion.split("T")[0];
      this.cuota.fecha_vencimiento = this.cuota.fecha_vencimiento.split("T")[0];
      this.theFormGroup.patchValue(this.cuota);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.cuotasService.create(serviceData).subscribe(() => {
        Swal.fire("Creado", "La cuota se ha creado exitosamente", "success");
        this.router.navigate(["cuotas/list"]);
      });
    } else if (this.mode === 3) {
      this.cuotasService.update(serviceData).subscribe(() => {
        Swal.fire("Actualizado", "La cuota se ha actualizado exitosamente", "success");
        this.router.navigate(["cuotas/list"]);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('contrato_id')?.errors) {
        this.showFieldError('Campo Contrato', 'El contrato es obligatorio.');
        return false;
      }

      if (this.theFormGroup.get('factura_id')?.errors) {
        this.showFieldError('Campo Factura', 'La factura es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('monto')?.errors) {
        this.showFieldError('Campo Monto', 'El monto es obligatorio y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('tasa_interes')?.errors) {
        this.showFieldError('Campo Tasa de Interés', 'La tasa de interés debe estar entre 0 y 100.');
        return false;
      }

      if (this.theFormGroup.get('fecha_generacion')?.errors) {
        this.showFieldError('Campo Fecha de Generación', 'La fecha de generación es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('fecha_vencimiento')?.errors) {
        this.showFieldError('Campo Fecha de Vencimiento', 'La fecha de vencimiento es obligatoria.');
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
