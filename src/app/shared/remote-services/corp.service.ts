import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CorpBusiness, Corp, CorpEmployee } from 'src/app/shared/schemas/corp';
import { environment } from 'src/environments/environment';
import { PageResult } from 'src/app/shared/page-result';
import { CustomEncoder } from 'src/app/shared/custom-encoder';
import { map } from 'rxjs/operators';

export declare class CorpStautsResult {
    code:number;
    enable:boolean;
}

@Injectable({providedIn: 'root'})
export class CorpService{

    constructor(private _http: HttpClient) { }

    business(id: string): Observable<CorpBusiness>{
        return null;
    }

    corp(id: number):Observable<Corp>{
        return this._http.get<Corp>(`${environment.apiUrl}/construct-project-cache/data/corp/${id}`);
    }


    patchCorp(business: CorpBusiness, code?: number): Observable<number>{

        return this._http.post<number>(`${environment.apiUrl}/construct-attach-corp/path/${code ? 'modify/' + code: 'create'}`,business, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
    }

    changeCorpStatus(code: number,enable: boolean): Observable<CorpStautsResult>{
        return this._http.delete<CorpStautsResult>(`${environment.apiUrl}/construct-attach-corp/mgr/${enable ? 'enable' : 'disable'}/${code}`)
    }

    search(page:number, valid: string, key: string, type: | null):Observable<PageResult<Corp>>{
        let params = new HttpParams({encoder: new CustomEncoder()}).set("page",page ? page.toString() : '0');
        params = params.append("valid",valid);
        params = params.append("key", key);
        if (type){
            params = params.append('type',type);
        }
        //console.log("search business params:", JSON.stringify(params));
        return this._http.get<PageResult<Corp>>(`${environment.apiUrl}/construct-attach-corp/view/list`,{params: params});
    }

    groupNumberExists(type:string,number:string,code:number | null):Observable<boolean>{
        console.log("call validator:" + `${environment.apiUrl}/construct-attach-corp/view/corp/exists/${type}/${number}${code ? '/' + code : ''}`);
        return this._http.get<string>(`${environment.apiUrl}/construct-attach-corp/view/corp/exists/${type}/${number}${code ? '/' + code : ''}`, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
        .pipe(
            map(result => (Boolean(JSON.parse(result))))
        );
    }

    corpInBusiness(code: number):Observable<boolean>{
        return this._http.get<string>(`${environment.apiUrl}/construct-attach-corp/view/business/exists/corp/${code}`, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
        .pipe(
            map(result => (Boolean(JSON.parse(result))))
        );
    }

    listNamedCorps(offset:number, term: string):Observable<PageResult<Corp>>{
        let params = new HttpParams({encoder: new CustomEncoder()})
        if (term ){
          params = params.append("key",term);
        }
        return this._http.get<PageResult<Corp>>(`${environment.apiUrl}/construct-attach-corp/view/names/${offset}`,{params: params});
    }

    listCorpEmployee(code: number):Observable<CorpEmployee[]>{
        return this._http.get<CorpEmployee[]>(`${environment.apiUrl}/construct-attach-corp/view/corp/${code}/employee`);
    }

    corpEmployee(id: number):Observable<CorpEmployee>{
        return this._http.get<CorpEmployee>(`${environment.apiUrl}/construct-attach-corp/view/employee/${id}`);
    }

    addEmployee(code: number, employee: CorpEmployee):Observable<number>{
        return this._http.post<number>(`${environment.apiUrl}/construct-attach-corp/mgr/corp/${code}/employee/add`, employee,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
    }

    resetEmployeePassword(username:string):Observable<String>{
        return this._http.put<String>(`${environment.apiUrl}/authenticationservice/admin/trust/reset/${username}`, null, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
    }
}