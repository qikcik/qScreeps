import {TaskRepository} from "./taskRepository";
import {DataMem, starterWorkerTask, State} from "./task/starterWorker";
import {CreateTaskMem, TaskMem} from "./task";
import {Logger} from "../util/logger";
import {TaskType} from "./taskConst";

declare global {
  interface CreepMemory {
    controller: ControllerMem
  }
}

interface ControllerMem {
  executionTaskStack: Array<TaskMem>
}
const creepControllerDefault = {
  executionTaskStack: []
}


const taskRepository = new TaskRepository();
taskRepository.registerTaskImpl(starterWorkerTask);


export class CreepController
{
  private readonly creep: Creep;
  private readonly memory: ControllerMem;
  constructor(creep:Creep) {
    this.creep = creep;
    _.defaultsDeep(creep.memory,{ controller: creepControllerDefault});
    this.memory = creep.memory.controller;
  }

  tick(){
    this.stateMachineTick();

    let msg = ""
    for(let i = 0; i != 3 && i != this.memory.executionTaskStack.length; i++)
    {
      msg += this.memory.executionTaskStack[i].type;
    }
    if(this.memory.executionTaskStack.length > 0)
      msg += "|"+this.memory.executionTaskStack[this.memory.executionTaskStack.length-1].state

    this.creep.say(msg,true);
  }

  stateMachineTick()
  {
    let stack = this.memory.executionTaskStack;

    if(stack.length == 0)
    {
      Logger.log("err",`empty stack ${this.creep.name}`);
      stack.push(CreateTaskMem<State,DataMem>(TaskType.starterWorker, State.default, {sourceID:"5bbcb0469099fc012e63bd99",targetID:"5bbcb0469099fc012e63bd9a"}))
      return;
    }

    while(true)
    {
      let stackIdx = stack.length-1;
      if(stackIdx == -1)
      {
        Logger.log("err",`stack ended ${this.creep.name}`);
        return;
      }
      let taskImpl = taskRepository.getTaskImpl(stack[stackIdx].type);
      if(!taskImpl)
      {
        Logger.log("err",`${this.creep.name} cannot found ${stack[stackIdx].type} task`);
        stack.pop();
        continue;
      }

      let cb = taskImpl!.getState(stack[stackIdx].state);
      if(!cb)
      {
        Logger.log("err",`${this.creep.name} cannot found state ${stack[stackIdx].state} in ${stack[stackIdx].type} task`);
        stack[stackIdx].state = taskImpl.defaultState;
        continue;
      }
      let res = cb(this.creep,stack[stackIdx].data);

      switch (res.type)
      {
        case "ok":
          Logger.log("wrn",`${this.creep.name}  task ${taskImpl.type} will be continued on state ${stack[stackIdx].state}`);
          return;
        case "finish":
          Logger.log("wrn",`${this.creep.name}  task finished ${taskImpl.type} last state ${stack[stackIdx].state}`);
          stack.pop()
          return;
        case "abort":
          Logger.log("err",`${this.creep.name}  task aborted ${taskImpl.type} last state ${stack[stackIdx].state} reason ${res.reasonDescription}`);
          stack.pop()
          return;
        case "requestNewStateInNextTick":
          Logger.log("wrn",`${this.creep.name}  task ${taskImpl.type} ${stack[stackIdx].state} new state in next tick ${res.newState}`);
          stack[stackIdx].state = res.newState;
          return;
        case "requestInstantNewState":
          Logger.log("wrn",`${this.creep.name}  task ${taskImpl.type} ${stack[stackIdx].state} instant new state ${res.newState}`);
          stack[stackIdx].state = res.newState;
          continue;
      }
    }
  }
}

