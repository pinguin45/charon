export class NanomsgService {

    public message: string;
    public sub: any = new nanomsg.Socket(nanomsg.SUB);

    public attached(): any {
      this.connect();
      this.sub.on('data', (msg: any) => {
        this.message = msg;
      });
    }

    public connect(): void {
      this.sub.connect('ws://192.168.161.230:1337');
    }

  }
