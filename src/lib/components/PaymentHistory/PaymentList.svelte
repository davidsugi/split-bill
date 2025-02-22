<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import MobileCardLayout from '$lib/components/PaymentHistory/mobile/MobileCardLayout.svelte';
    import WebTableLayout from '$lib/components/PaymentHistory/web/WebTableLayout.svelte';
    import { members, rows } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS, type formSelectType } from '$lib/types/index.js';
    import { roundCurrency } from '$lib/utils/currencyUtils.js';
    import localStorage from '$lib/utils/localStorage.js';
    import { writable } from 'svelte/store';

    const { save } = localStorage;
    const defaultRow = { Who: undefined, Paid: 0, What: '', For: [], Price: 0 };
    const editMode = writable($rows.map(() => false));

    function addRow(): void {
        saveRowState();
        rows.update(r => {
            const newRows = [...r, { ...defaultRow }];
            editMode.set(newRows.map((_, index) => index === newRows.length - 1));
            return newRows;
        });
    }

    function saveRowState(): void {
        rows.subscribe(r => save(LOCAL_STORAGE_KEYS.rows, JSON.stringify(r)));
    }

    function handleMultiSelectChange(event: CustomEvent<formSelectType[]>, rowIndex: number): void {
        rows.update(r => {
            const selectedOptions = event.detail;
            const haveAll = selectedOptions.some((forOption) => forOption.value === 'ALL');
            if (haveAll) {
                r[rowIndex].For = $members.map(member => ({ label: member, value: member }));
            } else {
                r[rowIndex].For = selectedOptions;
            }
            r[rowIndex].Price = roundCurrency(r[rowIndex].Paid / r[rowIndex].For.length);
            return r;
        });
        saveRowState();
    }

    function handleSelectRemove(event: CustomEvent<formSelectType[]|formSelectType>, rowIndex: number): void {
        rows.update(r => {
            const selectedOptions = event.detail;
            if(Array.isArray(selectedOptions)) {
                r[rowIndex].For = [];
                return r;
            }
            r[rowIndex].For = r[rowIndex].For.filter((forOption) => forOption.value !== selectedOptions.value);
            r[rowIndex].Price = roundCurrency(r[rowIndex].Paid / r[rowIndex].For.length);
            return r;
        });
        saveRowState();
    }

    function handleSelectWhoChange(event: CustomEvent<formSelectType>, rowIndex: number): void {
        rows.update(r => {
            const selectedOptions = event.detail;
            if(r[rowIndex].Who?.value === selectedOptions.value){
                r[rowIndex].Who = undefined;
                saveRowState();
                return r;
            }
            r[rowIndex].Who = selectedOptions;
            return r;
        });
        saveRowState();
    }
</script>
  
<main class="container mx-auto p-4">
  <h2 class="font-bold text-2xl text-gray-700">Transaction List</h2>
  <div class="hidden sm:block">
    <WebTableLayout {handleSelectWhoChange} {handleMultiSelectChange} {handleSelectRemove} />
    <Button label="Add New Expenses" onClick={addRow} />
</div>

<div class="block sm:hidden">
    <MobileCardLayout {editMode} {handleSelectWhoChange} {handleMultiSelectChange} {handleSelectRemove} />
    <Button label="Add New Expenses" onClick={addRow} />
  </div>
  
</main>