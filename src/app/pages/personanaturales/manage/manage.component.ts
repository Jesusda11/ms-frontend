import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { Personanatural } from 'src/app/models/personanatural.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { PersonanaturalesService } from 'src/app/services/personanaturales.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  personanatural: Personanatural;
  mode: number; // mode=1 --> view, mode=2 --> create, mode=3 --> update
  theFormGroup: FormGroup; // Formulario con validaciones
  trySend: boolean;
  clientes: Cliente[] = []
  usuarios: Usuario[] = []

  constructor(
    private personanaturalesService: PersonanaturalesService,
    private clientesService: ClientesService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.personanatural = { nacionalidad: '', genero: '', cliente_id: 0, usuario_id: '', id: 0 };
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
      this.personanatural.id = this.activateRoute.snapshot.params.id;
      this.getPersonanatural(this.personanatural.id);
    }

    this.usuariosService.list().subscribe(data => {
      this.usuarios = data;
    });

    this.clientesService.list().subscribe(data => {
      this.clientes = data;
    });

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      nacionalidad: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', [Validators.required]],
      cliente_id: [null, [Validators.required, Validators.min(1)]],
      usuario_id: [null, [Validators.required, Validators.minLength(5)]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getPersonanatural(id: number) {
    this.personanaturalesService.view(id).subscribe(data => {
      this.personanatural = data['persona_natural'];
      this.personanatural.usuario_id = data['usuario']._id;
      this.theFormGroup.patchValue(this.personanatural);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.personanaturalesService.create(serviceData).subscribe(() => {
        Swal.fire("Creado", "Se ha creado exitosamente", "success");
        this.router.navigate(["personanaturales/list"]);
      });
    } else if (this.mode === 3) {
      this.personanaturalesService.update(serviceData).subscribe(() => {
        Swal.fire("Actualizado", "Se ha actualizado exitosamente", "success");
        this.router.navigate(["personanaturales/list"]);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('nacionalidad')?.errors) {
        this.showFieldError('Campo Nacionalidad', 'La nacionalidad es obligatoria y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('genero')?.errors) {
        this.showFieldError('Campo Género', 'El género es obligatorio.');
        return false;
      }

      if (this.theFormGroup.get('cliente_id')?.errors) {
        this.showFieldError('Campo Cliente ID', 'El ID del cliente es obligatorio y debe ser mayor a 0.');
        return false;
      }

      if (this.theFormGroup.get('usuario_id')?.errors) {
        this.showFieldError('Campo Usuario ID', 'El ID de usuario es obligatorio y debe tener al menos 5 caracteres.');
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
