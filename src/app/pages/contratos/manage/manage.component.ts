import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { Contrato } from 'src/app/models/contrato.model';
import { Personanatural } from 'src/app/models/personanatural.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { PersonanaturalesService } from 'src/app/services/personanaturales.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  contrato: Contrato;
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;
  clientes: Personanatural[] = []

  constructor(
    private contratosService: ContratosService,
    private personasNaturalesService: PersonanaturalesService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.contrato = { id: 0, cliente_id: 0, valor: 0, fecha_inicio: '', fecha_fin: '' };
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
      this.contrato.id = this.activateRoute.snapshot.params.id;
      this.getContrato(this.contrato.id);
    }

    this.personasNaturalesService.list().subscribe(data => {
      this.clientes = data;
      this.clientes.forEach(admin => {
        this.usuariosService.view(admin.usuario_id).subscribe(usuario => {
          admin.usuario_name = usuario.name;
        });
      });
    });

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      cliente_id: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(1)]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getContrato(id: number) {
    this.contratosService.view(id).subscribe(data => {
      this.contrato = data;
      this.contrato.fecha_inicio = this.contrato.fecha_inicio.split('T')[0];
      this.contrato.fecha_fin = this.contrato.fecha_fin.split('T')[0];
      this.theFormGroup.patchValue(this.contrato);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const contratoData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.contratosService.create(contratoData).subscribe(() => {
        Swal.fire('Creado', 'El contrato se ha creado exitosamente.', 'success');
        this.router.navigate(['contratos/list']);
      });
    } else if (this.mode === 3) {
      this.contratosService.update(contratoData).subscribe(() => {
        Swal.fire('Actualizado', 'El contrato se ha actualizado exitosamente.', 'success');
        this.router.navigate(['contratos/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('cliente_id')?.errors) {
        this.showFieldError('Campo Cliente', 'El cliente es obligatorio');
        return false;
      }

      if (this.theFormGroup.get('valor')?.errors) {
        this.showFieldError('Campo Valor', 'El valor del contrato es obligatorio y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('fecha_inicio')?.errors) {
        this.showFieldError('Campo Fecha de Inicio', 'La fecha de inicio es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('fecha_fin')?.errors) {
        this.showFieldError('Campo Fecha de Fin', 'La fecha de fin es obligatoria.');
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
