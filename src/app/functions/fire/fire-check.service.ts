import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FireCheck } from './schemas';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PageResult } from 'src/app/shared/page-result';
import { CustomEncoder } from 'src/app/shared/custom-encoder';

@Injectable({providedIn: 'root'})
export class FireCheckService{

  constructor(private _http: HttpClient) { }
  
  create(fireCheck: any): Observable<{id:string ,inRandom:boolean}>{
    return this._http.post<any>(`${environment.apiUrl}/construct-fire/manager/apply`,fireCheck);
  }

  fireCheck(id: number): Observable<FireCheck>{
    return this._http.get<FireCheck>(`${environment.apiUrl}/construct-fire/manager/check/${id}`)
  }

  search(page?:number, key?: string, status?: string,  sort?:string, dir?:string): Observable<PageResult<FireCheck>>{
    let params = new HttpParams({encoder: new CustomEncoder()}).set("page",page ? page.toString() : '0');
    if (status){
      params = params.append('status',status);
    }
    if (key){
      params = params.append('key',key);
    }
    if (sort){
      params = params.append('sort',sort);
    }    
    if (dir){
      params = params.append('dir',dir);
    }
    return this._http.get<PageResult<FireCheck>>(`${environment.apiUrl}/construct-fire/manager/search`,{params: params});
  }
}