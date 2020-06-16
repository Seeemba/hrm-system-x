import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ProviderAdapter} from '../models/payroll-provider.model';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:6502/application'; // TODO: use dotenv

  constructor(private http: HttpClient, private adapter: ProviderAdapter) {}

  list(): Observable<any[]> {
    const url = `${this.baseUrl}/labourstats`;
    return this.http
      .get(url)
      .pipe(
        tap(data => {
          console.log('Raw data from API ', data);
        }),
        map((data: any[]) => { // TODO: add checking of data and error handling
            const directContractors = data[0].directContractors.map((item) => this.adapter.adapt(item));
            const providers = data[0].providers.map((item) => this.adapter.adapt(item));
            const total = data[0].total.map((item) => this.adapter.adapt(item));

            return [{
              directContractors,
              providers,
              total
            }];
          }
        )
      );
  }
}
