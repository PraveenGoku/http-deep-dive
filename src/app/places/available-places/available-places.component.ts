import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { NgIf } from '@angular/common';
import { PlacesService } from '../places.service';

@Component({
	selector: 'app-available-places',
	standalone: true,
	templateUrl: './available-places.component.html',
	styleUrl: './available-places.component.css',
	imports: [PlacesComponent, PlacesContainerComponent,NgIf],
})
export class AvailablePlacesComponent implements OnInit {
  
	// places = signal<Place[] | undefined>(undefined);
	places : Place[] | undefined = undefined;
	
	isFetching = false;
	error = '';
	//Provide it in main.ts provideHttpClient() first to work. (For Standalone)
	//For Modules add it in Providers in Root Module/App Module
	private placesService = inject(PlacesService);
	private destroyRef = inject(DestroyRef);


	// constructor(private httpClient: HttpClient) {}
	ngOnInit(){
		this.isFetching = true;
		const subscription = this.placesService.loadAvailablePlaces().subscribe({
			next: (places)=>{
				// this.places.set(places);
				this.places=places;
			},
			error: (error: Error) => {
				this.error = error.message;
			},
			complete: () =>{
				this.isFetching = false;
			} 
		});

		this.destroyRef.onDestroy(()=>{
			subscription.unsubscribe();
		});
	}

	onSelectPlace(selectedPlace: Place){
		const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
			next: (resData)=> console.log(resData),
		});
		
		this.destroyRef.onDestroy(()=>{
			subscription.unsubscribe();
		});
	}
}
