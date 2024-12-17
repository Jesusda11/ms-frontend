import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, OnDestroy {
  vehiculo!: Vehiculo; // Información del vehículo
  map!: L.Map; // Referencia al mapa
  marker!: L.Marker; // Marcador en el mapa
  vehicleId!: number; // ID del vehículo
  updateInterval!: any; // Intervalo para actualizar la ubicación
  vehiculoSubscription!: Subscription; // Suscripción al servicio de vehículos

  constructor(
    private route: ActivatedRoute,
    private vehiculosService: VehiculosService
  ) {}

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.vehicleId) {
      this.vehiculosService.view(this.vehicleId).subscribe((vehiculo) => {
        this.vehiculo = vehiculo;
        this.initMap(vehiculo.latitud, vehiculo.longitud);
        this.startLocationUpdates();
      });
    }
  }

  // Inicializa el mapa
  initMap(lat: number, lng: number): void {
    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Crear ícono personalizado
    const vehicleIcon = L.icon({
      iconUrl: 'assets/img/icons/truck-icon.png', // Ruta del ícono
      iconSize: [32, 32],  // Tamaño del ícono
      iconAnchor: [16, 32],  // Ancla del ícono
      popupAnchor: [0, -32]  // Ajuste del popup
    });

    // Crear marcador para el vehículo con el ícono personalizado
    this.marker = L.marker([lat, lng], { icon: vehicleIcon }).addTo(this.map)
      .bindPopup(`Vehículo: ${this.vehiculo.matricula}`)
      .openPopup();
  }

  // Inicia el intervalo para actualizar la ubicación del vehículo
  startLocationUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.vehiculosService.view(this.vehicleId).subscribe((vehiculo) => {
        if (this.vehiculo && this.marker) {
          // Actualizar la posición si es diferente
          if (vehiculo.latitud !== this.vehiculo.latitud || vehiculo.longitud !== this.vehiculo.longitud) {
            this.vehiculo = vehiculo;
            this.marker.setLatLng([vehiculo.latitud, vehiculo.longitud]);
            this.marker.bindPopup(`Vehículo: ${vehiculo.matricula}`).openPopup();
          }
        }
      });
    }, 100); // Actualiza cada .1 segundos (ajustable)
  }

  // Detiene la actualización cuando el componente se destruye
  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.vehiculoSubscription) {
      this.vehiculoSubscription.unsubscribe();
    }
  }
}
