export const LOCAL_STORAGE_KEYS = {
    memberList: "MEMBER_LIST",
    rows: "DEBT_RECORDS",
}

export type formSelectType = {
    value: string;
    label: string;
}

export type Row = {
    [key: string]: undefined | formSelectType | string | number | formSelectType[];
    Who: formSelectType | undefined;
    Paid: number;
    What: string;
    For: formSelectType[];
    Price: number;
};