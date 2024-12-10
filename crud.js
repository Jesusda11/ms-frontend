const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const singularName = process.argv[2]; // Nombre de la entidad en singular (e.g., 'categoria')
const pluralName = process.argv[3]; // Nombre de la entidad en plural (e.g., 'categorias')
const attributesString = process.argv[4]; // Atributos en formato clave:valor (e.g., 'nombre:string,descripcion:string')

if (!singularName || !pluralName || !attributesString) {
  console.error('❌ Debes proporcionar el nombre de la entidad en singular, plural y los atributos: `node crud-generator.js [nombre-entidad-singular] [nombre-entidad-plural] [atributos]`');
  process.exit(1);
}

const singularCapitalized = capitalize(singularName); // Capitaliza la primera letra (e.g., 'Categoria')
const pluralCapitalized = capitalize(pluralName); // Capitaliza la primera letra del plural (e.g., 'Categorias')

// Procesar atributos
const attributes = attributesString.split(',').map(attr => {
  const [name, type] = attr.split(':');
  return { name, type };
});

// Verificar si id ya está en los atributos, si no, agregarlo
const hasId = attributes.some(attr => attr.name === 'id');
if (!hasId) {
  attributes.push({ name: 'id', type: 'number' });
}

try {
  console.log(`🚀 Creando módulo y routing para ${pluralName}`);
  execSync(`ng g m pages/${pluralName} --routing`, { stdio: 'inherit' });

  console.log(`🔧 Creando componentes 'list' y 'manage' para ${pluralName}`);
  execSync(`ng g c pages/${pluralName}/list --module=pages/${pluralName}`, { stdio: 'inherit' });
  execSync(`ng g c pages/${pluralName}/manage --module=pages/${pluralName}`, { stdio: 'inherit' });

  console.log(`🛠️ Configurando torre de control principal (AdminLayoutRoutingModule)`);
  const adminRoutingPath = './src/app/layouts/admin-layout/admin-layout.routing.ts';
  const adminRoutingContent = fs.readFileSync(adminRoutingPath, 'utf8');
  const updatedAdminRouting = adminRoutingContent.replace(
    '/* AUTO-ROUTES */',
    `{
        path: '${pluralName}',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/${pluralName}/${pluralName}.module').then(m => m.${pluralCapitalized}Module)
          }
        ]
      },
      /* AUTO-ROUTES */`
  );

  try {
    console.log(`🔄 Escribiendo cambios en ${adminRoutingPath}...`);
    fs.writeFileSync(adminRoutingPath, updatedAdminRouting, 'utf8');
    console.log(`✅ Ruta '${pluralName}' agregada correctamente en ${adminRoutingPath}`);
  } catch (error) {
    console.error(`❌ Error al escribir en ${adminRoutingPath}:`, error.message);
  }

  console.log(`📂 Configurando rutas específicas para ${pluralName}`);
  const routingFilePath = `./src/app/pages/${pluralName}/${pluralName}-routing.module.ts`;
  const routingFileContent = `
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'create', component: ManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${pluralCapitalized}RoutingModule {}
  `;
  fs.writeFileSync(routingFilePath, routingFileContent, 'utf8');

  console.log(`📄 Creando modelo ${singularCapitalized}`);
  execSync(`ng generate class models/${singularCapitalized} --type=model`, { stdio: 'inherit' });

  // Generar el contenido del modelo dinámicamente
  const modelFilePath = `./src/app/models/${singularCapitalized}.model.ts`;
  let modelContent = `export class ${singularCapitalized} {\n`;
  
  attributes.forEach(attr => {
    modelContent += `  ${attr.name}: ${attr.type != "date" ? attr.type : "string" };\n`;
  });
  modelContent += '}\n';

  fs.writeFileSync(modelFilePath, modelContent, 'utf8');

  console.log(`🛠️ Creando servicio para ${pluralName}`);
  const serviceFilePath = `./src/app/services/${pluralName}.service.ts`;
  const serviceContent = `
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ${singularCapitalized} } from '../models/${singularCapitalized.toLowerCase()}.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ${pluralCapitalized}Service {

  constructor(private http: HttpClient) { }

  list(): Observable<${singularCapitalized}[]> {
    return this.http.get<${singularCapitalized}[]>(\`\${environment.url_ms_business}/${pluralName}\`);
  }

  delete(id: number): Observable<${singularCapitalized}> {
    return this.http.delete<${singularCapitalized}>(\`\${environment.url_ms_business}/${pluralName}/\${id}\`);
  }

  view(id: number): Observable<${singularCapitalized}> {
    return this.http.get<${singularCapitalized}>(\`\${environment.url_ms_business}/${pluralName}/\${id}\`);
  }

  create(${pluralName}: ${singularCapitalized}): Observable<${singularCapitalized}> {
    delete ${pluralName}.id;
    return this.http.post<${singularCapitalized}>(\`\${environment.url_ms_business}/${pluralName}\`, ${pluralName});
  }

  update(${pluralName}: ${singularCapitalized}): Observable<${singularCapitalized}> {
    return this.http.put<${singularCapitalized}>(\`\${environment.url_ms_business}/${pluralName}/\${${pluralName}.id}\`, ${pluralName});
  }
}
  `;
  fs.writeFileSync(serviceFilePath, serviceContent, 'utf8');

  console.log(`✅ CRUD generado exitosamente para ${singularName}`);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(`📄 Configurando 'list.component.ts' para ${pluralName}`);
const listComponentPath = `./src/app/pages/${pluralName}/list/list.component.ts`;

const listComponentContent = `
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ${singularCapitalized} } from 'src/app/models/${singularCapitalized.toLowerCase()}.model';
import { ${pluralCapitalized}Service } from 'src/app/services/${pluralName}.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-${pluralName}-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  ${pluralName}: ${singularCapitalized}[] = [];

  constructor(private ${pluralName}Service: ${pluralCapitalized}Service, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.${pluralName}Service.list().subscribe(data => {
      this.${pluralName} = data;
    });
  }

  delete(id: number): void {
    Swal.fire({
      title: "Eliminación",
      text: "Está seguro que quiere eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.${pluralName}Service.delete(id).subscribe(() => {
          this.ngOnInit()
          Swal.fire({
            title: "Eliminado",
            text: "Se ha eliminado correctamente",
            icon: "success"
          });
        });
      }
    });
  }

  view(id: number): void {
    this.router.navigate([\"${pluralName}/view\",id]);
  }

  update(id: number): void {
    this.router.navigate([\"${pluralName}/update\",id]);
  }

  create(): void {
    this.router.navigate([\"${pluralName}/create\"]);
  }

  
}
`;

fs.writeFileSync(listComponentPath, listComponentContent, 'utf8');
console.log(`✅ 'list.component.ts' actualizado correctamente para ${pluralName}`);

// Generar el contenido de list.component.html dinámicamente
const listComponentHtmlPath = `./src/app/pages/${pluralName}/list/list.component.html`;

let tableHeaders = '';
let tableRows = '';

attributes.forEach(attr => {
  // Agregar encabezado de la tabla
  tableHeaders += `<th scope="col">${capitalize(attr.name)}</th>\n`;

  // Agregar celdas dinámicamente
  tableRows += `
    <td>{{actual.${attr.type.toLowerCase() == "date"? attr.name +" | date: 'yyyy-MM-dd' " : attr.name}}}</td>
  `;
});

const listComponentHtmlContent = `
<div class="header bg-gradient-danger pb-8 pt-5 pt-md-8">
</div>
<!-- Page content -->
<div class="container-fluid mt--7">
    <!-- Table -->
    <div class="row">
        <div class="col">
            <div class="card shadow">
                <div class="card-header border-0">
                    <h3 class="mb-0">${pluralCapitalized}</h3> 
                    <button type="button" class="btn btn-success" (click)="create()">Crear</button>   
                </div>
               <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                          ${tableHeaders}
                          <th scope="col">Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let actual of ${pluralName}">
                            ${tableRows}
                            <td>
                                <button type="button" class="btn btn-success" (click)="view(actual.id)">Visualizar</button>
                                <button type="button" class="btn btn-warning" (click)="update(actual.id)">Editar</button>
                                <button type="button" class="btn btn-danger" (click)="delete(actual.id)">Eliminar</button>
                            </td>
                        </tr>
                      </tbody>
                </table>
               </div>
            </div>
        </div>
    </div>
</div>
`;

fs.writeFileSync(listComponentHtmlPath, listComponentHtmlContent, 'utf8');
console.log(`✅ 'list.component.html' actualizado correctamente para ${pluralName}`);

//manage component ts
const manageComponentPath= `./src/app/pages/${pluralName}/manage/manage.component.ts`;

let atributos = '{';

attributes.forEach(attr => {
  console.log(attr);
  dato = null;
  if(attr.type.toLowerCase() == "number"){
    dato = 0
  }else if(attr.type.toLowerCase() == "string" || attr.type.toLowerCase() == "date"){
    dato = "''"
  }
  //falta el bool
  
  atributos += `${attr.name}: ${dato},`
  
});

//añadir para que formatee los dates
atrrFormat= ""
attributes.forEach(attr => {
  
  if(attr.type.toLowerCase() == "date"){
    atrrFormat+= `this.${singularName}.${attr.name} = this.${singularName}.${attr.name}.split("T")[0]` + "\n"
  }

});

atributos+="}"
atributos.replace(",}","}")

const ManageComponentContent = `
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ${singularCapitalized} } from 'src/app/models/${singularName}.model';
import { ${pluralCapitalized}Service } from 'src/app/services/${pluralName}.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  ${singularName}:${singularCapitalized}
  //mode=1 --> view, mode=2 -->create, mode=3 -->Update
  mode:number
  theFormGroup:FormGroup  // Es el que hace cumplir las reglas
  trySend:boolean  
  constructor(private  ${pluralName}Service:${pluralCapitalized}Service, //
              private activateRoute:ActivatedRoute, //Me sirve para analizar la URL de la página, que quieren hacer en el momento
              private router:Router, //Me ayuda a gestionar los archivos del routing/moverme entre componentes
              private theFormBuilder:FormBuilder //congreso
  ) { 
    this.${singularName}=${atributos}
    this.mode=0
    this.trySend=false
    this.configFormGroup()
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/'); //Tome foto de L url 
    if (currentUrl.includes('view')) { 
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) { //Tomele foto necesito el id
      this.${singularName}.id = this.activateRoute.snapshot.params.id
      this.get${singularCapitalized}(this.${singularName}.id)
    }
  }

  configFormGroup(){
    this.theFormGroup=this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      //capacity:[0,[Validators.required,Validators.min(1),Validators.max(100)]], //La lista son las reglas para aplicar a dicho campo
    })
  }
  get getTheFormGroup(){
    return this.theFormGroup.controls
  } //Esto devuelve realmente una variable

  get${singularCapitalized}(id:number){
    this.${pluralName}Service.view(id).subscribe(data =>{
      this.${singularName} = data
      ${atrrFormat}
    })
  }

  create(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.${pluralName}Service.create(this.${singularName}).subscribe(data =>{
      Swal.fire("Creado", "Se ha creado exitosamente","success")
      this.router.navigate(["${pluralName}/list"])
    })
  }

  update(){
    if(this.theFormGroup.invalid){
      this.trySend=true
      Swal.fire("Error en el formulario", "Ingrese correctamente los datos")
      return
    }
    this.${pluralName}Service.update(this.${singularName}).subscribe(data =>{
      Swal.fire("Actualizado", "Se ha actualizado exitosamente","success")
      this.router.navigate(["${pluralName}/list"])
    })
  }

}
`;

fs.writeFileSync(manageComponentPath, ManageComponentContent, 'utf8');
console.log(`✅ 'manage.component.html' actualizado correctamente para ${pluralName}`);

//manage component html
const manageComponentHtmlPath = `./src/app/pages/${pluralName}/manage/manage.component.html`;

let atrib = '';

tipoInput = {
  "number": "number",
  "string": "text",
  "date": "date"
}

attributes.forEach(attr => {
  // Agregar encabezado de la tabla 
   
  if(attr.name != "id"){
    atrib += `
        <div class="row">
            <div class="col-4">
                <label>${capitalize(attr.name)}:</label>
            </div>
            <div class="col-8">
                <input type="${tipoInput[attr.type.toLowerCase()]}" class="form-control" [disabled]="mode === 1" [(ngModel)]="${singularName}.${attr.name}">
            </div>
        </div> 
        <br/>
        `
  }
});

const ManageComponentHtmlContent = `
<div class="header bg-gradient-danger pb-8 pt-5 pt-md-8">

</div>
<!-- Page content -->
<div class="container-fluid mt--7">
    <!-- Table -->
    <div class="row">
        <div class="col">
            <div class="card shadow">
                <div class="card-header border-0">
                    <h3 *ngIf="mode==1" class="mb-0">Visualizar</h3>
                    <h3 *ngIf="mode==2" class="mb-0">Crear</h3>
                    <h3 *ngIf="mode==3" class="mb-0">Actualizar</h3>
                </div>
                <div class="card-body">
                    <div *ngIf="mode==1" class="row">
                        <div class="col-4">
                            <label>Id:</label>
                        </div>
                        <div class="col-8">
                            <input type="text" class="form-control" disabled [(ngModel)]="${singularName}.id">
                        </div>
                    </div>
                    <br>
                    ${atrib}
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-8">
                          <button *ngIf="mode==2" class="btn btn-success btn-block" (click)="create()">Crear</button>
                          <button *ngIf="mode==3" class="btn btn-success btn-block" (click)="update()">Actualizar</button>
                      </div>
                  </div>
                </div>


            </div>
        </div>
    </div>
</div>
`;

fs.writeFileSync(manageComponentHtmlPath, ManageComponentHtmlContent, 'utf8');
console.log(`✅ 'manage.component.html' actualizado correctamente para ${pluralName}`);


//routing

const RoutingComponentPath = `src/app/pages/${pluralName}/${pluralName}-routing.module.ts`;

const RoutingComponent = `
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {path: 'list', component:ListComponent},
  {path: 'create', component:ManageComponent},
  {path: 'update/:id', component: ManageComponent},
  {path: 'view/:id', component: ManageComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${pluralCapitalized}RoutingModule { }
`;

fs.writeFileSync(RoutingComponentPath, RoutingComponent, 'utf8');
console.log(`✅ 'routing.module.html' actualizado correctamente para ${pluralName}`);

//importaciones

const modulePath = `src/app/pages/${pluralName}/${pluralName}.module.ts`;


const modulePatHtml = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ${pluralCapitalized}RoutingModule } from './${pluralName}-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ${pluralCapitalized}RoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ${pluralCapitalized}Module { }
`;

fs.writeFileSync(modulePath, modulePatHtml, 'utf8');
console.log(`✅ 'module.html' actualizado correctamente para ${pluralName}`);
