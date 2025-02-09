

const localStorage = {
    save: function (key: string, value: string): void {
        window.localStorage.setItem(key, value);
    },
    load: function(key: string): string | null {
        return window.localStorage.getItem(key);
    }
}

export default localStorage;