type TableObject = {
  テーブル名: string,
  IDプレフィックス: string,
  親テーブル名: string,
  カラム: {カラム名: string, 型: string, 非必須?: boolean}[]
}


class NotImplementError extends Error {}

class TableDefRepository {
  obj: TableObject[];
  constructor() {
    this.obj = JSON.parse(localStorage.getItem("tables") || "[]") as TableObject[];
    console.log(this.obj);
  }
  private save() {
    localStorage.setItem("tables", JSON.stringify(this.obj));
  }
  findAll(): TableObject[] {
    return this.obj;
  }
  find(テーブル名: string): TableObject {
    const result = this.obj.find(v => v.テーブル名 == テーブル名);
    if(!result) {
      throw new Error("not found: " + テーブル名);
    }
    return result;
  }
  insert(テーブル: TableObject) {
    this.obj.push(テーブル);
    this.save();
  }
  
}

module Row {
  export type EntityObject = {
    テーブル名: string,
    親テーブル名: string,
    id: string,
    親Id: string,
    値: any
  }

  export type InsertArgs = {
    テーブル名: string,
    id: string,
    親Id: string,
    値: any
  }
  export class Repository {
    num = 0;
    obj: EntityObject[];
    constructor(private tableDefRepository: TableDefRepository) {
      this.obj = JSON.parse(localStorage.getItem("rows") || "[]") as EntityObject[]
    }
    private save() {
      localStorage.setItem("rows", JSON.stringify(this.obj));
    }
    createId(テーブル: TableObject): string {
      return `${テーブル.IDプレフィックス}_${Date.now()}_${this.num++}`
    }
    findAll(テーブル名: string): EntityObject[] {
      return this.obj.filter(v => v.テーブル名 == テーブル名)
    }
    find(テーブル名: string, id: string): EntityObject {
      const result = this.obj.find(v => v.id == id);
      if(!result) {
        throw new Error("not found: " + テーブル名);
      }
      return result;
    }
    insert(args: InsertArgs) {
      const テーブル = this.tableDefRepository.find(args.テーブル名);
      if(args.親Id || args.親Id.length > 0) {
        this.find(テーブル.親テーブル名, args.親Id); // 例外がスローされないことを確認
      }
      this.obj.push({...args, 親テーブル名: テーブル.親テーブル名})
      this.save();
    } 
  }
}

const tableDefRepository = new TableDefRepository();
// tableDefRepository.insert(new Table(
//   "タスク",
//   "T",
//   "タスク",
//   [
//     new Column("タイトル", "string"),
//     new Column("説明", "string"),
//     new Column("開始日", "date"),
//     new Column("完了日", "date"),
//     new Column("完了予定日", "date"),
//   ]
// ))

const rowRepository = new Row.Repository(tableDefRepository);
const タスクテーブル = tableDefRepository.find("タスク");
console.log(タスクテーブル);


// const id = rowRepository.createId(タスクテーブル);
// rowRepository.insert({
//   テーブル名: "タスク",
//   id: id,
//   親Id: "",
//   値: {
//   }
// })

const result = rowRepository.findAll("タスク");
console.log(result);