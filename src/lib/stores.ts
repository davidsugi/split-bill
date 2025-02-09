import { writable } from 'svelte/store';
import type { Row } from './types/index.js';

export const textValue = writable<string>('');
export const members = writable<string[]>([]);
export const rows = writable<Row[]>([{ Who: undefined, Paid: 0, What: '', For: [], Price: 0 }]);
export const debtInfo = writable<{ [key: string]: { totalDebt: number, owes: { [key: string]: number }, shouldCollect: { [key: string]: number } } }>({});
