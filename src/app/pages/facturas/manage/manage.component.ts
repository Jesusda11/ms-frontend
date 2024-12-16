import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura.model';
import { Administrador } from 'src/app/models/administrador.model';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';
import { log } from 'node:console';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  factura: Factura;
  administradores: Administrador[] = [];
  mode: number; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private facturasService: FacturasService,
    private administradoresService: AdministradoresService,
    private usuariosService: UsuariosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.factura = { id: 0, total: 0, fecha: "", estado:""};
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
      this.factura.id = this.activateRoute.snapshot.params.id;
      this.getfactura(this.factura.id);
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
      fecha: ['', [Validators.required]],
      total: ['', [Validators.required, Validators.min(0)]],
      estado: ['', [Validators.required]]  
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getfactura(id: number) {
    this.facturasService.view(id).subscribe(data => {
      this.factura = data;
      this.factura.fecha = this.factura.fecha.split("T")[0];
      this.theFormGroup.patchValue(this.factura);
    });
  }


    submitForm() {
      if (!this.validateForm()) return;
  
      const facturaData = this.theFormGroup.getRawValue();
  
      if (this.mode === 2) {
        this.facturasService.create(facturaData).subscribe(() => {
          Swal.fire("Creado", "Se ha creado exitosamente", "success");
          this.router.navigate(["facturas/list"]);
        });
      } else if (this.mode === 3) {
        this.facturasService.update(facturaData).subscribe(() => {
          Swal.fire("Actualizado", "Se ha actualizado exitosamente", "success");
          this.router.navigate(["facturas/list"]);
        });
      }
    }
  
  
    validateForm(): boolean {
      this.trySend = false;
  
      if (this.theFormGroup.invalid) {
        this.trySend = true;
  
  
        if (this.theFormGroup.get('estado')?.errors) {
          this.showFieldError('Campo estado', 'La dirección es obligatoria.');
          return false;
        }
  
        if (this.theFormGroup.get('fecha')?.errors) {
          this.showFieldError('Campo Fecha', 'La fecha es obligatoria.');
          return false;
        }
  
        if (this.theFormGroup.get('total')?.errors) {
          this.showFieldError('Campo total', 'ingrese un total válido.');
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
