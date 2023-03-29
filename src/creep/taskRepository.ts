import {TaskDataMem, TaskImpl, TaskState} from "./task";
import {TaskType} from "./taskConst";


export class TaskRepository
{

  public readonly tasks: Array<TaskImpl<any,any>>;

  constructor() {
    this.tasks = [];
  }


  registerTaskImpl<State extends TaskState,DataMem extends TaskDataMem>(task: TaskImpl<State,DataMem> ) {
    this.tasks.push(task);
  }

  getTaskImpl(type: TaskType): TaskImpl<TaskState,TaskDataMem> | undefined {
    return this.tasks.find(x => x.type == type)
  }
}
