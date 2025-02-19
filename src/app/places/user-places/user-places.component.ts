import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { NgIf } from '@angular/common';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent,NgIf],
})
export class UserPlacesComponent implements OnInit {
	// places = signal<Place[] | undefined>(undefined);
	// places : Place[] | undefined = undefined;
	
	isFetching = false;
	error = '';
	//Provide it in main.ts provideHttpClient() first to work. (For Standalone)
	//For Modules add it in Providers in Root Module/App Module
	private placesService = inject(PlacesService);
	private destroyRef = inject(DestroyRef);
	places = this.placesService.loadedUserPlaces;


	// constructor(private httpClient: HttpClient) {}
	ngOnInit(){
	this.isFetching = true;
	const subscription = this.placesService.loadUserPlaces()
	.subscribe({
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
	onRemovePlace(place: Place){
		const subscription = this.placesService.removeUserPlace(place)
		.subscribe();

		this.destroyRef.onDestroy(()=> {subscription.unsubscribe()});
	}

}
