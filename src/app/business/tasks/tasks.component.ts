import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchCondition, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Task } from '../schemas';
import { TaskRouterService } from './task-router.service';
import { CamundaRestService } from '../camunda-rest.service';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({templateUrl:"./tasks.html", styleUrls:['./tasks.scss']})
export class TasksComponent implements OnInit {

  tasks: Task[];

  userId: string;

  key: string = null;

  constructor(
    private _taskRoute: TaskRouterService,
    private _camundaService: CamundaRestService,
    private _authService: AuthenticationService,
    private _route: ActivatedRoute, _func: FunctionPageBar){
    _func.loadSearch({title:'业务办理',search: true}).subscribe(key => this.doSearch(key)); 
    _taskRoute.connectTaskChange().subscribe(() => this.refreshTasks());
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.key = params["key"]
      this.refreshTasks();
    })
    this._authService.getUserInfo().subscribe(user => this.userId = user.user_name);
  }

  doSearch(key: SearchCondition):void{
    this.key = key.key;
    if (key.now){
      this.refreshTasks(); 
    }
  }
  
  refreshTasks(){
    this._camundaService.getTasks(this.key).subscribe(tasks => this.tasks = tasks);
  }

  view(task: Task):void{
    this._taskRoute.view(task);
  }
  
  claim(id: string){
    this._authService.getUserInfo().pipe(
      switchMap(user => this._camundaService.claimTask(id,user.user_name).pipe(
        switchMap(() => (this._camundaService.getTasks()))
      )),
    
    ).subscribe(tasks => this.tasks = tasks);

  }

  unclaim(id: string){
    this._camundaService.unclaimTask(id).pipe(
      switchMap(() => (this._camundaService.getTasks()))
    ).subscribe(tasks => this.tasks = tasks);
  }

  completeTask(task: Task){
    this._taskRoute.complete(task);
  }

}