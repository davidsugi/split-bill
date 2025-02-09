type LocalStorage = {
    save(key: string, value: string): void;
    load(key: string): string | null;
}

export function localStorage(): LocalStorage {
    return {
        save(key: string, value: string): void {
            window.localStorage.setItem(key, value);
        },
        load(key: string): string | null {
            return window.localStorage.getItem(key);
        }
    }
    
}
