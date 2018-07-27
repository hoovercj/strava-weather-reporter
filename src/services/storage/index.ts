export interface IStorage {
    clear: () => void;
    getItem: <T>(key: string) => T | undefined;
    setItem: <T>(key: string, value: T) => void;
    removeItem: (key: string) => void;
}

class MemoryStorage implements IStorage {
    private storage: {[key: string]: any} = {};

    public clear = (): void => {
        this.storage = {};
    }

    public getItem = <T>(key: string, parse = true): T => {
        return this.storage[key];
    }

    public setItem = <T>(key: string, value: T): void => {
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

    public getItem = <T>(key: string): T | undefined => {
        const storedValue = localStorage.getItem(key);
        if (!storedValue) {
            return undefined;
        }

        try {
            return JSON.parse(storedValue || '');
        } catch (e) {
            return undefined;
        }
    }

    public setItem = <T>(key: string, value: T): void => {
        localStorage.setItem(key, JSON.stringify(value));
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

    public getItem = <T>(key: string): T | undefined => {
        return this.storage.getItem<T>(key);
    }

    public setItem = <T>(key: string, value: T): void => {
        this.storage.setItem(key, value);
    }

    public removeItem = (key: string): void => {
        this.storage.removeItem(key);
    }
}