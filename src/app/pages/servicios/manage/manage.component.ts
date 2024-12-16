import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from 'src/app/models/servicio.model';
import { Administrador } from 'src/app/models/administrador.model';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @ViewChild('nombreInput') nombreInput!: ElementRef;
  @ViewChild('direccionInput') direccionInput!: ElementRef;
  @ViewChild('descripcionInput') descripcionInput!: ElementRef;
  @ViewChild('fechaInput') fechaInput!: ElementRef;
  @ViewChild('administradorInput') administradorInput!: ElementRef;

  servicio: Servicio;
  administradores: Administrador[] = [];
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private serviciosService: ServiciosService,
    private administradoresService: AdministradoresService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.servicio = { nombre: '', direccion: '', descripcion: '', fecha: '', id: 0, administrador_id: 0 };
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
      this.servicio.id = this.activateRoute.snapshot.params.id;
      this.getServicio(this.servicio.id);
    }

    this.administradoresService.list().subscribe(data => {
      this.administradores = data;
      this.administradores.forEach(admin => {
        this.usuariosService.view(admin.usuario_id).subscribe(usuario => {
          admin.usuario_name = usuario.name;
        });
      });
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      administrador_id: ['', [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getServicio(id: number) {
    this.serviciosService.view(id).subscribe(data => {
      this.servicio = data;
      this.servicio.fecha = this.servicio.fecha.split("T")[0];
      console.log(this.servicio);
      
      this.theFormGroup.patchValue(this.servicio);
    });
  }

  
  submitForm() {
    if (!this.validateForm()) return;

    const serviceData = this.theFormGroup.getRawValue();

    if (this.mode === 2) {
      this.serviciosService.create(serviceData).subscribe(() => {
        Swal.fire("Creado", "Se ha creado exitosamente", "success");
        this.router.navigate(["servicios/list"]);
      });
    } else if (this.mode === 3) {
      this.serviciosService.update(serviceData).subscribe(() => {
        Swal.fire("Actualizado", "Se ha actualizado exitosamente", "success");
        this.router.navigate(["servicios/list"]);
      });
    }
  }


  validateForm(): boolean {
    this.trySend = false;

    if (this.theFormGroup.invalid) {
      this.trySend = true;

      if (this.theFormGroup.get('nombre')?.errors) {
        this.showFieldError('Campo Nombre', 'El nombre es obligatorio y debe tener al menos 3 caracteres.');
        return false;
      }

      if (this.theFormGroup.get('direccion')?.errors) {
        this.showFieldError('Campo Dirección', 'La dirección es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('descripcion')?.errors) {
        this.showFieldError('Campo Descripción', 'La descripción es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('fecha')?.errors) {
        this.showFieldError('Campo Fecha', 'La fecha es obligatoria.');
        return false;
      }

      if (this.theFormGroup.get('administrador_id')?.errors) {
        this.showFieldError('Campo Administrador', 'Selecciona un administrador válido.');
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
      icon: "warning",
      title: title,
      html: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}
