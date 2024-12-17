import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion } from 'src/app/models/direccion.model';
import { Direccionruta } from 'src/app/models/direccionruta.model';
import { Lote } from 'src/app/models/lote.model';
import { Ruta } from 'src/app/models/ruta.model';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { DireccionrutasService } from 'src/app/services/direccionrutas.service';
import { LoteService } from 'src/app/services/lote.service';
import { RutasService } from 'src/app/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  direccionruta: Direccionruta;
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  direcciones: Direccion[] = []
  rutas: Ruta[] = []
  lotes: Lote[] = []
  mode: number;
  theFormGroup: FormGroup;  // Es el que hace cumplir las reglas
  trySend: boolean;

  constructor(
    private direccionrutasService: DireccionrutasService,
    private direccionesService: DireccionesService,
    private rutasService: RutasService,
    private lotesService: LoteService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.direccionruta = {
      direccion_id: 0,
      ruta_id: 0,
      lote_id: 0,
      fecha_entrega: '',
      distancia: 0,
      estado: '',
      orden_de_paso: 0,
      id: 0
    };
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/'); //Tome foto de L url
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.theFormGroup.disable(); // Desactiva todos los controles del FormGroup
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) { //Tomele foto necesito el id
      this.direccionruta.id = this.activateRoute.snapshot.params.id;
      this.getDireccionruta(this.direccionruta.id);
    }

    this.direccionesService.list().subscribe(data => {
      this.direcciones = data;
    });

    this.rutasService.list().subscribe(data => {
      this.rutas = data;
    });

    this.lotesService.list().subscribe(data => {
      this.lotes = data;
    });

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      direccion_id: [this.direccionruta.direccion_id, [Validators.required]],
      ruta_id: [this.direccionruta.ruta_id, [Validators.required]],
      lote_id: [this.direccionruta.lote_id, [Validators.required]],
      fecha_entrega: [this.direccionruta.fecha_entrega, [Validators.required]],
      distancia: [this.direccionruta.distancia, [Validators.required, Validators.min(0)]],
      estado: [this.direccionruta.estado, [Validators.required]],
      orden_de_paso: [this.direccionruta.orden_de_paso, [Validators.required, Validators.min(1)]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDireccionruta(id: number) {
    this.direccionrutasService.view(id).subscribe((data) => {
      this.direccionruta = data;
      this.direccionruta.fecha_entrega = this.direccionruta.fecha_entrega.split("T")[0];
      this.theFormGroup.patchValue(this.direccionruta);
    });
  }

  
    submitForm() {
      if (!this.validateForm()) return;
  
      const serviceData = this.theFormGroup.getRawValue();
  
      if (this.mode === 2) {
        this.direccionrutasService.create(serviceData).subscribe(() => {
          Swal.fire("Creado", "Se ha creado exitosamente", "success");
          this.router.navigate(["direccionrutas/list"]);
        });
      } else if (this.mode === 3) {
        this.direccionrutasService.update(serviceData).subscribe(() => {
          Swal.fire("Actualizado", "Se ha actualizado exitosamente", "success");
          this.router.navigate(["direccionrutas/list"]);
        });
      }
    }
  

  // Mostrar alerta personalizada para los campos con errores
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

  // Validar el formulario antes de enviar
  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      // Validar campos específicos
      if (this.theFormGroup.get('direccion_id')?.errors) {
        this.showFieldError('Campo Dirección', 'La dirección es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('ruta_id')?.errors) {
        this.showFieldError('Campo Ruta', 'La ruta es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('lote_id')?.errors) {
        this.showFieldError('Campo Lote', 'El lote es obligatorio.');
        return false;
      }

      if (this.theFormGroup.get('fecha_entrega')?.errors) {
        this.showFieldError('Campo Fecha de Entrega', 'La fecha de entrega es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('distancia')?.errors) {
        this.showFieldError('Campo Distancia', 'La distancia es obligatoria y debe ser mayor que 0.');
        return false;
      }

      if (this.theFormGroup.get('estado')?.errors) {
        this.showFieldError('Campo Estado', 'El estado es obligatorio.');
        return false;
      }

      if (this.theFormGroup.get('orden_de_paso')?.errors) {
        this.showFieldError('Campo Orden de Paso', 'El orden de paso es obligatorio y debe ser mayor que 0.');
        return false;
      }

      // Error genérico
      Swal.fire('Error en el formulario', 'Corrige los errores antes de continuar.', 'error');
      return false;
    }

    return true;
  }
}
