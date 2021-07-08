import { UserInterface } from "./user-interface";

export class CommandLineUserInterface implements UserInterface {
  log(msg: any) {
    console.log(msg);
  }
  warn(msg: any) {
    console.warn(msg);
  }
  error(msg: any) {
    console.error(msg);
  }
  
}