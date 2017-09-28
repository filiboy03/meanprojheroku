//Author: Filmon, Citation: Developer name- Ashcopenhaur 

import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Task} from './Task';

@Component({
  moduleId: module.id,
  selector: 'tasks',
  templateUrl: 'tasks.component.html'
})

export class TasksComponent { 
    tasks;
    title: string;
    
    constructor(private taskService:AuthService){
        this.taskService.getTasks()
            .subscribe(task => {
                console.log("from task component==>"+ task);
                this.tasks = task;
            });
    }
    
    addTask(event){
        event.preventDefault();
        var newTask = {
            task_id: Math.random(),
            title: this.title,
            isDone: false
        }
        
        this.taskService.addTask(newTask)
            .subscribe(task => {
               this.tasks.push(task);
                console.log('task is printing==>'+ task);
                this.title = '';
            });
    }
    
    deleteTask(task){
        var tasks = this.tasks;
        
        this.taskService.deleteTask(task.task_id).subscribe(data => {
            if(data.n == 1){
                for(var i = 0;i < tasks.length;i++){
                    if(tasks[i].task_id == task.task_id){
                        tasks.splice(i, 1);
                    }
                }
            }
        });
    }
    
    updateStatus(task){
        var _task = {
            task_id: task.task_id,
            title: task.title,
            isDone: !task.isDone
        };
        console.log('from update in componen==>'+_task.task_id)
        this.taskService.updateStatus(_task).subscribe(data => {
            task.isDone = !task.isDone;
        });
    }

}
