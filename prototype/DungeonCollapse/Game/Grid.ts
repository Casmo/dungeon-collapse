
class Grid<T> {
    constructor(w: number, h: number) {
        this.Width = w;
        this.Height = h;
        this.Cells = new Array<Array<T>>();
        for (var i = 0; i < this.Width; i++) {
            var row = new Array<T>();
            for (var j = 0; j < this.Height; j++) {
                row.push(null);
            }
            this.Cells.push(row);
        }
    }
    Cells: Array<Array<T>>;
    Width: number;
    Height: number;
    Set(x: number, y: number, content: T) { this.Cells[x][y] = content; }
    Get(x: number, y: number): T { return this.Cells[x][y]; }
    Inside(x: number, y: number): Boolean { return x >= 0 && x < this.Width && y >= 0 && y < this.Height; }
    AsString(): string {
        var str: string = "";
        for (var i = 0; i < this.Width; i++) {
            for (var j = 0; j < this.Height; j++) {
                str += this.Cells[i][j].toString();
            }
            str += "\n";
        }
        return str;
    }
    Dump() { console.log(this.AsString()); }
    GetNeighbour(dir: string, x: number, y: number): T {
        var nx = x, ny = y;
        switch (dir) {
            case "up": ny--; break;
            case "down": ny++; break;
            case "left": nx--; break;
            case "right": nx++; break;
        }
        if (this.Inside(nx, ny))
            return this.Cells[nx][ny];
        else return null;
    }

    Middle(): T {
        return this.Cells[Math.floor((this.Width - 1) / 2)][Math.floor((this.Height - 1) / 2)];
    }
    Flip(horizontal: boolean) {
        if (horizontal) {
            for (var i = 0; i < this.Width/2; i++) {
                for (var j = 0; j < this.Height; j++) {
                    var target = i + ((this.Width - 1) - (i * 2));
                    var temp = this.Cells[i][j];
                    this.Cells[i][j] = this.Cells[target][j];
                    this.Cells[target][j] = temp;
                }
            }
        }
        else {
            for (var i = 0; i < this.Width; i++) {
                for (var j = 0; j < this.Height / 2; j++) {
                    var target = j + ((this.Height - 1) - (j * 2));
                    var temp = this.Cells[i][j];
                    this.Cells[i][j] = this.Cells[i][target];
                    this.Cells[i][target] = temp;
                }
            }
        }
    }
}