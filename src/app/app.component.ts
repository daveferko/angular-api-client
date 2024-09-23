import { Component, inject, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  http = inject(HttpClient); // Inject HttpClient without constructor
  newStories: any[] = [];  //To hold data from API
  total = 0; // Total number of stories
  limit = 8; // Number of stories per page
  title = 'Hacker News';
  currentPage = 1;

  query: string = '';
  searchResults: any[] = [];


  ngOnInit(): void {
    this.getNewStories(); //Fetch data on Component initialization   
  }

  //Fetch data using HttpClient
  getNewStories(): void {
    const apiUrl = 'https://localhost:7117/api/HackerNews/newstories';

    const params = new HttpParams()

      .set('page', this.currentPage.toString())
      .set('pageSize', this.limit.toString());

    this.http.get(apiUrl, { params }).subscribe(
      (response: any) => {
        this.newStories = response.data; // Assign the paginated data
        this.total = response.totalCount; // Assign the total number of IDs
      },
      (error) => {
        console.error('Error fetching data:', error); 
      }
    );
  }

  get paginatedStories() {
    const startIndex = (this.currentPage - 1) * this.limit;
    return this.newStories.slice(startIndex, startIndex + this.limit);
  }

  searchStories() {
    if (this.query) {
      this.http.get<any[]>(`https://localhost:7117/api/HackerNews/search?query=${this.query}`)
        .subscribe(
          (data) => this.searchResults = data,
          (error) => console.error('Error fetching search results:', error)
        );
    }
  }

  goToPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getNewStories();
    }
  }

  goToNext() {

    if (this.currentPage > 0) {
      this.currentPage++;
      this.getNewStories();
      
    }
    
  }
  
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }
}
