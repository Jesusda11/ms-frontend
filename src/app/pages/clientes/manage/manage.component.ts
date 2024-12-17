import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'node:console';
import { Cliente } from 'src/app/models/cliente.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  cliente: Cliente;
  usuarios: Usuario[]=[]
  showPersonaNaturalForm: boolean = false; // Controla visibilidad del formulario
  mode: number; // 1=View, 2=Create, 3=Update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private clientesService: ClientesService,
    private activateRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.cliente = {
      id: 0,
      fechaRegistro: '',
      preferencias: '',
      personanatural: { nacionalidad: '', genero: '', usuario_id: null, id: 0 }
    };
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
      this.cliente.id = this.activateRoute.snapshot.params.id;
      this.getCliente(this.cliente.id);
    }

    this.usuariosService.list().subscribe(data => {
      this.usuarios = data;
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      fechaRegistro: ['', [Validators.required]],
      preferencias: ['', [Validators.required, Validators.minLength(3)]],
      nacionalidad: [''],
      genero: [''],
      usuario_id: ['']

    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }
  updatePersonaNaturalValidators() {
    const nacionalidadControl = this.theFormGroup.get('nacionalidad');
    const generoControl = this.theFormGroup.get('genero');
    const usuarioIdControl = this.theFormGroup.get('usuario_id');
  
    if (this.showPersonaNaturalForm) {
      // Aplica Validators.required cuando showPersonaNaturalForm es true
      nacionalidadControl?.setValidators([Validators.required]);
      generoControl?.setValidators([Validators.required]);
      usuarioIdControl?.setValidators([Validators.required]);
    } else {
      // Elimina las validaciones cuando showPersonaNaturalForm es false
      nacionalidadControl?.clearValidators();
      generoControl?.clearValidators();
      usuarioIdControl?.clearValidators();
    }
  
    // Actualiza el estado de los controles
    nacionalidadControl?.updateValueAndValidity();
    generoControl?.updateValueAndValidity();
    usuarioIdControl?.updateValueAndValidity();
  }
  

  getCliente(id: number) {
    this.clientesService.view(id).subscribe(data => {
      this.cliente = data;
      this.cliente.fechaRegistro = this.cliente.fechaRegistro.split('T')[0];
      this.theFormGroup.patchValue(this.cliente);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const clientData = this.theFormGroup.getRawValue();
    console.log(clientData);
    const data = {
        fechaRegistro: clientData.fechaRegistro,
        preferencias: clientData.preferencias,
        personanatural: { nacionalidad: clientData.nacionalidad, genero: clientData.genero, usuario_id: clientData.usuario_id}
    }
    
    if (this.mode === 2) {  
      this.clientesService.create(data).subscribe(() => {
        Swal.fire('Creado', 'Se ha creado exitosamente', 'success');
        this.router.navigate(['clientes/list']);
      });
    } else if (this.mode === 3) {
      this.clientesService.update(clientData).subscribe(() => {
        Swal.fire('Actualizado', 'Se ha actualizado exitosamente', 'success');
        this.router.navigate(['clientes/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('fechaRegistro')?.errors) {
        this.showFieldError('Campo Fecha de Registro', 'La fecha es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('preferencias')?.errors) {
        this.showFieldError(
          'Campo Preferencias',
          'Las preferencias son obligatorias y deben tener al menos 3 caracteres.'
        );
        return false;
      }

      const personaNaturalGroup = this.theFormGroup
      if(this.showPersonaNaturalForm){
        if (personaNaturalGroup?.get('nacionalidad')?.errors) {
          this.showFieldError('Campo Nacionalidad', 'La nacionalidad es obligatoria.');
          return false;
        }
        if (personaNaturalGroup?.get('genero')?.errors) {
          this.showFieldError('Campo Género', 'El género es obligatorio.');
          return false;
        }
        if (personaNaturalGroup?.get('usuario_id')?.errors) {
          this.showFieldError('Campo Usuario ID', 'El ID de usuario es obligatorio.');
          return false;
        }
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

  togglePersonaNatural() {
    this.showPersonaNaturalForm = !this.showPersonaNaturalForm;
    this.updatePersonaNaturalValidators()
  }

}
