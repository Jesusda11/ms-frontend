import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Conductor } from 'src/app/models/conductor.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ConductorService } from 'src/app/services/conductor.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  conductor: Conductor;
  usuarios: Usuario[] = [];
  mode: number; // 1 = view, 2 = create, 3 = update
  theFormGroup: FormGroup; // El formulario reactivo
  trySend: boolean;

  constructor(
    private conductorsService: ConductorService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.conductor = { id: 0, usuario_id: '', licencia_conduccion: '', anios_experiencia: 0 };
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup(); // Configuración inicial del formulario
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
      this.conductor.id = this.activateRoute.snapshot.params.id;
      this.getConductor(this.conductor.id);
    }

    this.usuariosService.list().subscribe(data => {
      this.usuarios = data;
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      usuario_id: ['', [Validators.required]],
      licencia_conduccion: ['', [Validators.required, Validators.minLength(1)]],
      anios_experiencia: [0, [Validators.required, Validators.min(0), Validators.max(90)]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getConductor(id: number) {
    this.conductorsService.view(id).subscribe(data => {
      this.conductor = data['conductor'];
      this.theFormGroup.patchValue(this.conductor);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const formData = this.theFormGroup.getRawValue();

    if (this.mode === 2) { // Crear
      this.conductorsService.create(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El conductor se ha creado exitosamente.',
        });
        this.router.navigate(['conductores/list']);
      });
    } else if (this.mode === 3) { // Actualizar
      this.conductorsService.update(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El conductor se ha actualizado exitosamente.',
        });
        this.router.navigate(['conductores/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('usuario_id')?.errors) {
        this.showFieldError('Campo Usuario', 'Selecciona un usuario válido.');
        return false;
      }

      if (this.theFormGroup.get('licencia_conduccion')?.errors) {
        this.showFieldError(
          'Campo Licencia de Conducción',
          'La licencia es obligatoria y debe tener al menos 5 caracteres.'
        );
        return false;
      }

      if (this.theFormGroup.get('anios_experiencia')?.errors) {
        this.showFieldError(
          'Campo Años de Experiencia',
          'Debe ingresar un número válido entre 0 y 90.'
        );
        return false;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor, corrige los errores antes de continuar.',
      });
      return false;
    }

    return true;
  }

  private showFieldError(title: string, message: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}
