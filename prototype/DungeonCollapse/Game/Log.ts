class Log {
    entries: Array<string>;
    html: HTMLElement;
    constructor(elem:HTMLElement) {
        this.entries = new Array<string>();
        this.html = elem;
        
    }
    write(txt: string) {
        this.entries.push(txt);
        this.update(txt);
    }
    update(txt:string) {
        this.html.innerHTML += txt+'</br>';
    }

} 