
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, ValidationErrors, FormControl, AsyncValidator, AsyncValidatorFn, AbstractControl, NgForm, FormGroupDirective } from '@angular/forms';

import { Router, Params } from '@angular/router';



import { Component, OnInit, Injectable } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';


import { Corp, CorpInfo, CorpReg, CorpBusiness } from 'src/app/shared/schemas/corp';
import { DataUtilsService, JoinType } from 'src/app/shared/schemas/define';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CorpService } from '../../shared/remote-services/corp.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError, map } from 'rxjs/operators';
import { empty, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { PageResult } from 'src/app/shared/page-result';
import { PageEvent } from '@angular/material/paginator';
import { identityNoValidator, IdentityNumberParentMatcher } from 'src/app/tools/validator/identityNumberValidator';
import { ErrorStateMatcher } from '@angular/material/core';



@Component({
  selector: 'app-main',
  templateUrl: './corp.component.html',
  styleUrls: ['./corp.component.scss']
})
export class CorpComponent extends SearchFunctionBase implements OnInit {

  faRegistered = faRegistered;
  dataPage: PageResult<Corp>;

  params: {showDisabled : boolean, type: string};

  constructor(
    public dataUtil: DataUtilsService,
    private _router: Router,
    private _route: ActivatedRoute,
    _func: FunctionPageBar) {
    super(_route,_func);
  }

  doSearch(condition: SearchCondition): void {
    if (condition.now){
      let params: Params = {page:0};
      params['key'] = condition.key;
      
      this._router.navigate([],{relativeTo: this._route, queryParams: params, queryParamsHandling: 'merge' })
    }
  }

  onShowDisabledChange(){
    this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,valid: !this.params.showDisabled}, queryParamsHandling: 'merge'})
  }

  onTypeChange(type: string){

    if (!type || type === '' || type === this.params.type){
      this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,type: null}, queryParamsHandling: 'merge'})
    }else{
      this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,type: type}, queryParamsHandling: 'merge'})
    }


  }

  onPageChange(pageEvent: PageEvent){
    console.log("chang page:" , pageEvent.pageIndex);

    if ((pageEvent.pageIndex) !== this.dataPage.number){

      this._router.navigate([], {relativeTo: this._route, queryParams: {page: pageEvent.pageIndex} ,queryParamsHandling: 'merge'});
    }
  }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => this.params = {showDisabled: JSON.parse(params.get('valid')) ,type : params.get('type')})
    this._route.data.subscribe(data =>{this.dataPage = data.dataPage; console.log(data.dataPage)} )
  }

}



const ownerIdentityNumberValidator: ValidatorFn = (control:FormGroup) : ValidationErrors | null =>{
    console.log("person id vad");
  
  if (!control.get('ownerId').value || control.get('ownerId').value == '' || (control.get('ownerId').value.length > 32)){
    return null;
  }
  if(control.get('ownerIdType').value === 'MASTER_ID'){
    return identityNoValidator(control.get('ownerId') as FormControl)
  }
  return null;
}


function uniqueCorpGroupNumberValidator(_service: CorpService,_code: number | null): AsyncValidatorFn {

  return (control: AbstractControl):  Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const type = control.get('groupIdType').value;
    const number = control.get('groupId').value;
    console.log("person id vad");
    if (type && number ){
      return _service.groupNumberExists(type,number,_code).pipe(
        map(exists => (exists ? {'group-number':'conflict'} : null),
        catchError(err => {console.log(err); return of(null)})
      ));
    }else{
      return of(null);
    }


  }

} 

class GroupNumberParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return ((control.parent.invalid && control.parent.getError('group-number')) || control.invalid)&& control.touched;
  }
}

@Component({
  selector: 'corp-edit',
  templateUrl: './corp-edit.component.html',
  styleUrls: ['./corp-edit.component.scss']
})
export class CorpEditComponent extends PageFunctionBase implements OnInit{

  identityNumberParentMatcher = new IdentityNumberParentMatcher();

  groupNumberParentMatcher = new GroupNumberParentMatcher();
 
  corp: Corp;

  businessForm: FormGroup;

  joinTypes:{id: string, name: string}[];

  oldJoinTypes: {type:string,level: number, number: string, limit: Date, del: boolean}[];

  removedTypes :Set<string> = new Set<string>();

  get regsForm(): FormArray{
    return this.businessForm.get('regs') as FormArray;
  }

  typeIsOld(type: string):boolean{
    return !!this.corp && !!this.corp.regs.find(reg => reg.property == type);
  }

  constructor(
    public dataUtils: DataUtilsService,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _service: CorpService,
    private _ngxService: NgxUiLoaderService,
    private _toastr: ToastrService,
    _func: FunctionPageBar) {
    super(_route,_func);
  }

  private calcJoinTypes():void{

    if (this.corp){
      this.oldJoinTypes = this.corp.regs
        .filter(cr => (!this.businessForm.value.regs.find(reg => (reg.property == cr.property))))
        .map(reg => ({type: reg.property, level: reg.info.level, number: reg.info.levelNumber, limit: reg.info.regTo, del: !! this.removedTypes.has(reg.property)}));
    }
    this.joinTypes = Object.keys(JoinType).filter(key => {
      if (!this.corp){
        return !this.businessForm.value.regs.find(reg => reg.property == key)
      }else{
        return !this.businessForm.value.regs.find(reg => (reg.property == key)) 
          && !this.corp.regs.find(reg => (reg.property == key));
      }
    }).map(key => ({id: key, name: JoinType[key]}));
  }

  private addInfoForm(info? : CorpInfo){

  
    this.businessForm.addControl('info' , this._fb.group({
      name: [info ? info.name : null, [Validators.required,Validators.maxLength(128)]],
      groupIdType: [info ? info.groupIdType : null, Validators.required],
      groupId: [info ? info.groupId : null,  [Validators.required,Validators.maxLength(128)]],
      ownerName: [info ? info.ownerName : null, [Validators.required, Validators.maxLength(32)]],
      ownerIdType: [info ? info.ownerIdType : null, Validators.required],
      ownerId: [info ? info.ownerId : null,[Validators.required, Validators.maxLength(32)]],
      address: [info ? info.address : null,Validators.maxLength(256)],
      tel: [info ? info.tel: null,Validators.maxLength(16)],
    },{updateOn:'blur', validators: [ownerIdentityNumberValidator], asyncValidators: [uniqueCorpGroupNumberValidator(this._service, this.corp ? this.corp.code : null)]}));
  }



  infoEdit():void{
    if (this.corp){
      this.addInfoForm(this.corp.info);
    }
  }

  cancelInfoEdit():void{
    if (this.corp){
      this.businessForm.removeControl("info");
    }
  }

  addJoinType(type: string):void{
    console.log(type);
    let oldReg: CorpReg = null;
    if (this.corp){
      oldReg = this.corp.regs.find(reg => reg.property == type)
    }

    this.regsForm.push(this._fb.group({
      property: [type,Validators.required],
      operateType: [oldReg ? "MODIFY" : "CREATE",Validators.required],
      info: this._fb.group({     
        regTo: [oldReg ? oldReg.info.regTo : null,Validators.required],
        level: [oldReg ? oldReg.info.level : null,Validators.required],
        levelNumber: [oldReg ? oldReg.info.levelNumber : null ,Validators.maxLength(32)]
      })
    }));
    this.calcJoinTypes();
  }

  private removeType(type: string):void{
    for(let i = 0; i< this.regsForm.length; i++) {
      if (this.regsForm.value[i].property == type){
        this.regsForm.removeAt(i);
        break;
      }
    }
  }

  restoreType(type: string):void{
    this.removeType(type);
    this.removedTypes.delete(type);
    this.calcJoinTypes();
  }

  deleteType(type: string):void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title:'移除确认', description: '确认要移除此角色？' , result: type }});
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.removeType(result);
        if (!!this.corp && !!this.corp.regs.find(reg => (reg.property == result))){
          this.removedTypes.add(result);
        }
        this.calcJoinTypes();
      }
    });
  }

  get joinTypeVaild(): boolean{
    if (this.corp){
      return !!this.corp.regs.find(reg => (!this.removedTypes.has(reg.property))) || this.regsForm.length > 0
    }else{
      return this.regsForm.length > 0 ;
    }
    
  }

  get valid(): boolean{
    return this.businessForm.valid && this.joinTypeVaild && (!this.corp || !!this.businessForm.value.info || (this.removedTypes.size > 0) || (this.regsForm.value.length > 0));
  }

  onSubmit() {
    this._ngxService.start();
    
    let business: CorpBusiness = this.businessForm.value;

    let save$:Observable<number>;
 
    if (this.corp){
      this.removedTypes.forEach(key => business.regs.push({property: key, operateType: 'DELETE', info: this.corp.regs.find(reg => reg.property == key).info}));
      console.log(business);
      save$ = this._service.patchCorp(business,this.corp.code);
    }else{
      save$ = this._service.patchCorp(business);
    }

    save$.pipe(catchError(err=>{
      this._ngxService.stop();
      this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
      return empty();
    })).subscribe(id => {
      this._ngxService.stop();

      this._router.navigate([this.corp ? '../../' : '../','details',id,'info'],{relativeTo: this._route});
    });
    

  }

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      
      this.corp = data.corp;
 
      this.businessForm = this._fb.group({
        applyTime: [Date.now()],
        regs: this._fb.array([])
      })


      if (!this.corp){
        this.addInfoForm();
      }

      this.calcJoinTypes();
      
    })
  }
  
}



