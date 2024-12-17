import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'node:console';
import { Conductor } from 'src/app/models/conductor.model';
import { Duenio } from 'src/app/models/duenio.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ConductorService } from 'src/app/services/conductor.service';
import { DueniosService } from 'src/app/services/duenios.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  duenio: Duenio;
  usuarios: Usuario[] = []
  conductores: Conductor[] = []
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private dueniosService: DueniosService,
    private usuariosService: UsuariosService,
    private conductoresService: ConductorService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.duenio = { id: 0, conductor_id: 0, usuario_id: '' };
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
      this.duenio.id = this.activateRoute.snapshot.params.id;
      this.getDuenio(this.duenio.id);
    }

    this.usuariosService.list().subscribe(data => {
      this.usuarios = data;
    });

    this.conductoresService.list().subscribe(data => {
      this.conductores = data;
      this.conductores.forEach(conductor =>{
        this.usuariosService.view(conductor.usuario_id).subscribe((usuario) => {
          conductor.usuario_name = usuario.name;
        });
      })
    });
   
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      conductor_id: [0, [Validators.required]],
      usuario_id: ['', [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDuenio(id: number) {
    this.dueniosService.view(id).subscribe(data => {
      this.duenio = data;    
      this.theFormGroup.patchValue(this.duenio["duenio"]);
    });
  }

  submitForm() {
    if (!this.validateForm()) return;

    const formData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.dueniosService.create(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El dueño se ha creado exitosamente.',
        });
        this.router.navigate(['duenios/list']);
      });
    } else if (this.mode === 3) {
      this.dueniosService.update(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El dueño se ha actualizado exitosamente.',
        });
        this.router.navigate(['duenios/list']);
      });
    }
  }

  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('conductor_id')?.errors) {
        this.showFieldError('Campo Conductor', 'El conductor es obligatorio');
        return false;
      }

      if (this.theFormGroup.get('usuario_id')?.errors) {
        this.showFieldError('Campo Usuario', 'El usuario es obligatorio');
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

  showGastos(id:number){
    this.router.navigate(["gastos/filterByDuenio", + id ])
  }
}
