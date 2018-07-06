export interface IStorage {
    clear: () => void;
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
}

class MemoryStorage implements IStorage {
    private storage = {};

    public clear = (): void => {
        this.storage = {};
    }

    public getItem = (key: string): string => {
        return this.storage[key];
    }

    public setItem = (key: string, value: string): void => {
        this.storage[key] = value;
    }

    public removeItem = (key: string): void => {
        delete this.storage[key];
    }
}

// tslint:disable-next-line:max-classes-per-file
class LocalStorage implements IStorage {
    public static IsAvailable = (): boolean => {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

    public clear = (): void => {
        localStorage.clear();
    }

    public getItem = (key: string): string | null => {
        return localStorage.getItem(key);
    }

    public setItem = (key: string, value: string): void => {
        localStorage.setItem(key, value);
    }

    public removeItem = (key: string): void => {
        localStorage.removeItem(key);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Storage implements IStorage {
    private storage: IStorage;

    constructor() {
        if (LocalStorage.IsAvailable()) {
            this.storage = new LocalStorage();
        } else {
            this.storage = new MemoryStorage();
        }
    }

    public clear = (): void => {
        this.storage.clear();
    }

    public getItem = (key: string): string | null => {
        return this.storage.getItem(key);
    }

    public setItem = (key: string, value: string): void => {
        this.storage.setItem(key, value);
    }

    public removeItem = (key: string): void => {
        this.storage.removeItem(key);
    }
}