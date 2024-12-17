import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'node:console';
import { Administrador } from 'src/app/models/administrador.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  administrador: Administrador;
  usuarios: Usuario[] = [];
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private administradoresService: AdministradoresService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.administrador = { nivel_acceso: '', usuario_id: '', id: 0 };
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
      this.administrador.id = this.activateRoute.snapshot.params.id;
      this.getAdministrador(this.administrador.id);
    }

    this.usuariosService.list().subscribe(data => {
      this.usuarios = data;
    });

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      nivel_acceso: ['', [Validators.required, Validators.minLength(3)]],
      usuario_id: ['', [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getAdministrador(id: number) {
    this.administradoresService.view(id).subscribe(data => {
      this.administrador = data;
      this.administrador = data["administrador"]   

      this.theFormGroup.patchValue(this.administrador);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const formData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.administradoresService.create(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El administrador se ha creado exitosamente.',
        });
        this.router.navigate(['administradores/list']);
      });
    } else if (this.mode === 3) {
      console.log("datos a enviar: ", formData);
      
      this.administradoresService.update(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El administrador se ha actualizado exitosamente.',
        });
        this.router.navigate(['administradores/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('nivel_acceso')?.errors) {
        this.showFieldError('Campo Nivel de Acceso', 'El nivel de acceso es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('usuario_id')?.errors) {
        this.showFieldError('Campo Usuario', 'Selecciona un usuario válido.');
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
