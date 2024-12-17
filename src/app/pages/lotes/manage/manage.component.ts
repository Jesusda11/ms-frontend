import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lote } from 'src/app/models/lote.model';
import { Ruta } from 'src/app/models/ruta.model';
import { LoteService } from 'src/app/services/lote.service';
import { RutasService } from 'src/app/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  lote: Lote;
  rutas: Ruta[] = [];
  mode: number;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private lotesService: LoteService,
    private activateRoute: ActivatedRoute,
    private rutasService: RutasService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.lote = { id: 0, tipo_carga: '', peso: 0, ruta_id: 0 };
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.theFormGroup.disable(); // Desactiva todos los controles del FormGroup
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.lote.id = this.activateRoute.snapshot.params.id;
      this.getLote(this.lote.id);
    }

    this.rutasService.list().subscribe(data => {
      this.rutas = data;
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      tipo_carga: ['', [Validators.required, Validators.minLength(3)]],
      peso: [0, [Validators.required, Validators.min(1)]],
      ruta_id: [0, [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getLote(id: number) {
    this.lotesService.view(id).subscribe(data => {
      this.lote = data;
      this.theFormGroup.patchValue(this.lote);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.lotesService.create(serviceData).subscribe(() => {
        Swal.fire('Creado', 'Se ha creado exitosamente', 'success');
        this.router.navigate(['lotes/list']);
      });
    } else if (this.mode === 3) {
      this.lotesService.update(serviceData).subscribe(() => {
        Swal.fire('Actualizado', 'Se ha actualizado exitosamente', 'success');
        this.router.navigate(['lotes/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('tipo_carga')?.errors) {
        this.showFieldError('Campo Tipo de Carga', 'El tipo de carga es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('peso')?.errors) {
        this.showFieldError('Campo Peso', 'El peso es obligatorio y debe ser mayor que 0.');
        return false;
      }

      if (this.theFormGroup.get('ruta_id')?.errors) {
        this.showFieldError('Campo Ruta', 'Selecciona una ruta válida.');
        return false;
      }

      // Error genérico
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
