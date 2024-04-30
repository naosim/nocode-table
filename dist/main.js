// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class TableDefRepository {
    obj;
    constructor(){
        this.obj = JSON.parse(localStorage.getItem("tables") || "[]");
        console.log(this.obj);
    }
    save() {
        localStorage.setItem("tables", JSON.stringify(this.obj));
    }
    findAll() {
        return this.obj;
    }
    find(テーブル名) {
        const result = this.obj.find((v)=>v.テーブル名 == テーブル名);
        if (!result) {
            throw new Error("not found: " + テーブル名);
        }
        return result;
    }
    insert(テーブル) {
        this.obj.push(テーブル);
        this.save();
    }
}
var Row;
(function(Row) {
    class Repository {
        tableDefRepository;
        num;
        obj;
        constructor(tableDefRepository){
            this.tableDefRepository = tableDefRepository;
            this.num = 0;
            this.obj = JSON.parse(localStorage.getItem("rows") || "[]");
        }
        save() {
            localStorage.setItem("rows", JSON.stringify(this.obj));
        }
        createId(テーブル) {
            return `${テーブル.IDプレフィックス}_${Date.now()}_${this.num++}`;
        }
        findAll(テーブル名) {
            return this.obj.filter((v)=>v.テーブル名 == テーブル名);
        }
        find(テーブル名, id) {
            const result = this.obj.find((v)=>v.id == id);
            if (!result) {
                throw new Error("not found: " + テーブル名);
            }
            return result;
        }
        insert(args) {
            const テーブル = this.tableDefRepository.find(args.テーブル名);
            if (args.親Id || args.親Id.length > 0) {
                this.find(テーブル.親テーブル名, args.親Id);
            }
            this.obj.push({
                ...args,
                親テーブル名: テーブル.親テーブル名
            });
            this.save();
        }
    }
    Row.Repository = Repository;
})(Row || (Row = {}));
const tableDefRepository = new TableDefRepository();
const rowRepository = new Row.Repository(tableDefRepository);
const タスクテーブル = tableDefRepository.find("タスク");
console.log(タスクテーブル);
const id = rowRepository.createId(タスクテーブル);
rowRepository.insert({
    テーブル名: "タスク",
    id: id,
    親Id: "",
    値: {}
});
const result = rowRepository.findAll("タスク");
console.log(result);
