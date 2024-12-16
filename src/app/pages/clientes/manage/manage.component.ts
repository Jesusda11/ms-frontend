import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { ClientesService } from 'src/app/services/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  cliente: Cliente;
  personaNatural: any = {}; // Objeto para datos de Persona Natural
  showPersonaNaturalForm: boolean = false; // Controla visibilidad del formulario
  mode: number; // 1 -> View, 2 -> Create, 3 -> Update
  theFormGroup: FormGroup; // Formulario para validaciones
  trySend: boolean;  

  constructor(
    private clientesService: ClientesService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) { 
    this.cliente = { fechaRegistro: '', preferencias: '', id: 0 , personanatural:{nacionalidad: '',
      genero: '',
      usuario_id: null,
    id:0}};
    this.mode = 0;
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) { 
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.cliente.id = this.activateRoute.snapshot.params.id;
      this.getCliente(this.cliente.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // Añade aquí las validaciones necesarias
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getCliente(id: number) {
    this.clientesService.view(id).subscribe(data => {
      this.cliente = data;
      this.cliente.fecha_registro = this.cliente.fecha_registro.split("T")[0];
    });
  }

  openPersonaNaturalForm() {
    this.showPersonaNaturalForm = true;
  }

  closePersonaNaturalForm() {
    this.showPersonaNaturalForm = false;
  }

  savePersonaNatural() {
    this.cliente.personanatural = this.personaNatural; // Asigna los datos al cliente
    this.closePersonaNaturalForm();
  }

  create() {
    if (this.theFormGroup.invalid) {
      this.trySend = true;
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos");
      return;
    }
    this.clientesService.create(this.cliente).subscribe(data => {
      Swal.fire("Creado", "Se ha creado exitosamente", "success");
      this.router.navigate(["clientes/list"]);
    });
  }

  update() {
    if (this.theFormGroup.invalid) {
      this.trySend = true;
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos");
      return;
    }
    this.clientesService.update(this.cliente).subscribe(data => {
      Swal.fire("Actualizado", "Se ha actualizado exitosamente", "success");
      this.router.navigate(["clientes/list"]);
    });
  }

  togglePersonaNatural() {
    this.showPersonaNaturalForm = !this.showPersonaNaturalForm;
  }

  showProductos(id:number){
    this.router.navigate(["productos/showProductos", + id])
  }

  showContracts(id:number){
    this.router.navigate(["contratos/filterByClient", + id ])
  }
}
