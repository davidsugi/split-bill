<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import MobileCardLayout from '$lib/components/PaymentHistory/mobile/MobileCardLayout.svelte';
    import WebTableLayout from '$lib/components/PaymentHistory/web/WebTableLayout.svelte';
    import { members, rows } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS, type formSelectType } from '$lib/types/index.js';
    import { roundCurrency } from '$lib/utils/currencyUtils.js';
    import localStorage from '$lib/utils/localStorage.js';
    import { writable, derived } from 'svelte/store';
    import IconifyIcon from "@iconify/svelte";
    import { formatCurrency } from '$lib/utils/currencyUtils.js';

    const { save } = localStorage;
    const defaultRow = { Who: undefined, Paid: 0, What: '', For: [], Price: 0 };
    const editMode = writable($rows.map(() => false));

    const totalAmount = derived(rows, $rows => {
        return $rows.reduce((total, row) => total + row.Paid, 0);
    });

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

    function deleteRow(rowIndex: number): void {
        rows.update(r => {
            const newRows = r.filter((_, index) => index !== rowIndex);
            editMode.set(newRows.map(() => false));
            return newRows;
        });
        saveRowState();
    }
</script>
  
<main class="container mx-auto p-2 lg:p-4 ">
  <h2 class="font-bold text-2xl text-gray-700">Transaction List</h2>
  <div class="hidden sm:block">
    <WebTableLayout totalAmount={$totalAmount}  {handleSelectWhoChange} {handleMultiSelectChange} {handleSelectRemove} {deleteRow} />
    <Button label="Add New Expenses" onClick={addRow} />
  </div>

  <div class="block sm:hidden">
    <MobileCardLayout {editMode} {handleSelectWhoChange} {handleMultiSelectChange} {handleSelectRemove} {deleteRow} />
    <button 
      class="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      on:click={addRow}
    >
      <IconifyIcon icon="mdi:plus" class="w-6 h-6" />
    </button>
    <div class="mt-4">
        <h3 class="font-bold text-xl text-gray-700">Total: Rp. {formatCurrency($totalAmount)}</h3>
    </div>
  </div>

  
</main>