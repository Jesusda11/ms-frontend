import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'node:console';
import { Cliente } from 'src/app/models/cliente.model';
import { Lote } from 'src/app/models/lote.model';
import { Personanatural } from 'src/app/models/personanatural.model';
import { Producto } from 'src/app/models/producto.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { LoteService } from 'src/app/services/lote.service';
import { PersonanaturalesService } from 'src/app/services/personanaturales.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  producto: Producto;
  lotes: Lote[] = []
  clientes: Personanatural[] = []
  // mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode: number;
  theFormGroup: FormGroup;  // Es el que hace cumplir las reglas
  trySend: boolean;

  constructor(private productosService: ProductoService,
              private activateRoute: ActivatedRoute,
              private usuariosService: UsuariosService,
              private lotesService: LoteService,
              private clientesService: PersonanaturalesService,
              private router: Router,
              private theFormBuilder: FormBuilder) {
    this.producto = { id: 0, nombre: '', cantidad: 0, peso: 0, lote_id: 0, cliente_id: 0 };
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/'); //Tome foto de la URL
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.theFormGroup.disable(); // Desactiva todos los controles del FormGroup
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.producto.id = this.activateRoute.snapshot.params.id;
      this.getProducto(this.producto.id);
    }
    this.lotesService.list().subscribe(data => {
      this.lotes = data;
    });

    this.clientesService.list().subscribe(data => {
      this.clientes = data;
      this.clientes.forEach(cliente => {
        this.usuariosService.view(cliente.usuario_id).subscribe(usuario => {
          cliente.usuario_name = usuario.name;
        });
      });
    });

  }

  // Configuración de los validadores del FormGroup
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      peso: [0, [Validators.required, Validators.min(1)]],
      lote_id: [0, [Validators.required]],
      cliente_id: [0, [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getProducto(id: number) {
    this.productosService.view(id).subscribe(data => {
      this.producto = data;
      this.theFormGroup.patchValue(this.producto);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.productosService.create(serviceData).subscribe(() => {
        Swal.fire("Creado", "Se ha creado exitosamente", "success");
        this.router.navigate(["productos/list"]);
      });
    } else if (this.mode === 3) {
      this.productosService.update(serviceData).subscribe(() => {
        Swal.fire("Actualizado", "Se ha actualizado exitosamente", "success");
        this.router.navigate(["productos/list"]);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      // Validadores para cada campo
      if (this.theFormGroup.get('nombre')?.errors) {
        this.showFieldError('Campo Nombre', 'El nombre es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('cantidad')?.errors) {
        this.showFieldError('Campo Cantidad', 'La cantidad es obligatoria y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('peso')?.errors) {
        this.showFieldError('Campo Peso', 'El peso es obligatorio y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('lote_id')?.errors) {
        this.showFieldError('Campo Lote', 'Selecciona un lote válido.');
        return false;
      }

      if (this.theFormGroup.get('cliente_id')?.errors) {
        this.showFieldError('Campo Cliente', 'Selecciona un cliente válido.');
        return false;
      }

      // Error genérico si algún campo no es válido
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
