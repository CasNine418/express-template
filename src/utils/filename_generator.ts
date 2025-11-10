export class FilenameGenerator {
    private name: string = 'old';

    constructor(name: string) {
        this.name = name;
    }

    public static new(name: string): FilenameGenerator {
        return new FilenameGenerator(name);
    }

    public generate = (time: number | Date, index?: number): string => {
        if (!time) {
            return "latest.log";
        } else {
            const date = new Date(time);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            const second = String(date.getSeconds()).padStart(2, '0');
            const paddedIndex = String(index).padStart(2, "0");

            return `${year}${month}${day}-${hour}${minute}${second}-${paddedIndex}-${this.name}.log`;
        }
    }
}