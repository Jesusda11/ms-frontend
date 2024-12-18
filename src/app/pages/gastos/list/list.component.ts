
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gasto } from 'src/app/models/gasto.model';
import { GastosService } from 'src/app/services/gastos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gastos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  duenio_id:number
  gastos: Gasto[] = [];

  constructor(private gastosService: GastosService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.duenio_id = this.route.snapshot.params['id'];

    const currentUrl = this.route.snapshot.url.join('/');
    if (currentUrl.includes('filterByDuenio')) {
      this.filterByDuenio();
    } else {
      this.list();
    }  
  }

  list(): void {
    this.gastosService.list().subscribe(data => {
      this.gastos = data;
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
        this.gastosService.delete(id).subscribe(() => {
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
    this.router.navigate(["gastos/view",id]);
  }

  update(id: number): void {
    this.router.navigate(["gastos/update",id]);
  }

  create(): void {
    this.router.navigate(["gastos/create"]);
  }

  filterByDuenio(): void {
    this.gastosService.listByDuenio(this.duenio_id).subscribe(data => {
      this.gastos = data;
      console.log(this.gastos);
    });
  }

  
    pagar(id: Number): void{
      Swal.fire({
        title: "Ingresa por favor tu número de tarjeta",
        input: "number",  // Especificamos que el input será un número
        inputAttributes: {
          autocapitalize: "off",
          min: "1000",  // Puedes agregar una validación del número mínimo (si es necesario)   // y un número máximo para el campo de la tarjeta
        },
        showCancelButton: true,
        confirmButtonText: "Pagar",
        showLoaderOnConfirm: true,
        preConfirm: async (cardNumber) => {
          try {
            // Verificamos que el número de tarjeta no esté vacío
            if (!cardNumber) {
              Swal.showValidationMessage('Por favor ingresa un número de tarjeta válido');
              return;
            }
      
            // Aquí construimos la URL del endpoint que se quiere llamar
            const url = `http://127.0.0.1:3333/pago/gasto/${id}`;
      
            // Realizamos la solicitud al backend (puedes usar fetch o axios)
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "card_number": cardNumber,
                "exp_year": "2025",
                "exp_month": "12",
                "cvc": "123",
                "name": "Juan",
                "last_name": "Pérez",
                "email": "juan.perez@example.com",
                "phone": "3001234567",
                "doc_number": "123456789",
                "city": "Bogotá",
                "address": "Calle Ficticia 123",
                "cell_phone": "3009876543",
                "bill": Math.round(Math.floor(Math.random() * 101)),
                "value": 50000
              }), // Aquí puedes agregar otros datos si es necesario
            });
            
            console.log("respuesta payment: ",response);
        
            // Si la respuesta no es exitosa, mostramos el mensaje de error
            if (!response.ok) {
              const errorData = await response.json();
              return Swal.showValidationMessage(`Error: ${errorData.message || 'Error en el pago'}`);
            }
      
            // Si la solicitud es exitosa, retornamos los datos del pago
            return response.json();
      
          } catch (error) {
            // Si hay un error en la solicitud, lo mostramos
            Swal.showValidationMessage(`Solicitud fallida: ${error}`);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el pago fue exitoso, mostramos un mensaje
          this.ngOnInit()
          Swal.fire({
            title: 'Pago realizado',
            text: `El pago fue exitoso`,
            icon: 'success',
          });
  
        }
      });
      
      
    }
  
  
}
