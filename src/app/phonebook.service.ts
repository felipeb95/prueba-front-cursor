import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhonebookService {

  constructor(private http: HttpClient) { }

  getPersons(): Observable<any> {
    return this.http.get('https://private-anon-1b833e2c30-testphonebook.apiary-mock.com/persona');
  }

  getRegions(): Observable<any> {
    return this.http.get('https://private-anon-1b833e2c30-testphonebook.apiary-mock.com/region');
  }
}
