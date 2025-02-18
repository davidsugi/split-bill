<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import { debtInfo, members, rows } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS, type formSelectType } from '$lib/types/index.js';
    import { roundCurrency } from '$lib/utils/currencyUtils.js';
    import localStorage from '$lib/utils/localStorage.js';
    import { onMount } from 'svelte';
    import Select from 'svelte-select';

    const { load, save } = localStorage;

    const headers: string[] = ['Who', 'Paid', 'What', 'For', "Price"];
    const defaultRow = { Who: undefined, Paid: 0, What: '', For: [], Price: 0 };

    onMount(() => {
        const savedTextValue = load(LOCAL_STORAGE_KEYS.memberList);
        if (savedTextValue) {
            loadState();
        }
    });

    function addRow(): void {
        saveRowState();
        rows.update(r => [...r, { ...defaultRow }]);
    }

    function saveRowState(): void {
        rows.subscribe(r => save(LOCAL_STORAGE_KEYS.rows, JSON.stringify(r)));
    }


    function saveDebtInfoState(): void {
        debtInfo.subscribe(r => save(LOCAL_STORAGE_KEYS.debtInfo, JSON.stringify(r)));
    }

    function loadState(): void {
        const savedRows = load(LOCAL_STORAGE_KEYS.rows);
        if (savedRows) {
            rows.set(JSON.parse(savedRows));
        }
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

    function calculateDebt(): void {
        saveRowState();
        debtInfo.set({});
        members.subscribe(m => {
            m.forEach(member => {
                debtInfo.update(d => {
                    d[member] = {
                        totalDebt: 0,
                        owes: {},
                        shouldCollect: {}
                    };
                    return d;
                });
            });
        });

        rows.subscribe(r => {
            r.forEach(row => {
                if(row.Who === undefined || row.Paid === 0 || row.For.length === 0) {
                    return;
                }
                const lender = row.Who?.value || "none";
                const amount = row.Paid;
                const borrowers = row.For;
                const splitAmount = roundCurrency(amount / borrowers.length);
                
                borrowers.forEach(borrower => {
                    if (borrower.value !== lender) {
                        debtInfo.update(d => {
                            d[borrower.value].totalDebt += splitAmount;
                            d[borrower.value].owes[lender] = (d[borrower.value].owes[lender] || 0) + splitAmount;
                            d[lender].shouldCollect[borrower.value] = (d[lender].shouldCollect[borrower.value] || 0) + splitAmount;
                            return d;
                        });
                      }
                    });
                  });
                });

        debtInfo.update(d => {
            Object.keys(d).forEach(member => {
                const owes = d[member].owes;
                const shouldCollect = d[member].shouldCollect;

                Object.keys(owes).forEach(lender => {
                    if (shouldCollect[lender]) {
                        if (owes[lender] > shouldCollect[lender]) {
                            owes[lender] -= shouldCollect[lender];
                            delete shouldCollect[lender];
                        } else if (owes[lender] < shouldCollect[lender]) {
                            shouldCollect[lender] -= owes[lender];
                            delete owes[lender];
                        } else {
                            delete owes[lender];
                            delete shouldCollect[lender];
                        }
                    }
                });

                d[member].owes = owes;
                d[member].shouldCollect = shouldCollect;
            });
            return d;
        });

        saveDebtInfoState();
        console.log(debtInfo);
    }
</script>
  
<main class="container mx-auto p-4">
  <table class="mt-4 border-collapse border border-gray-300 w-full">
    <thead>
      <tr>
        {#each headers as header}
          <th class="border border-gray-300 p-2">{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each $rows as row, i}
        <tr>
          {#each headers as header}
            <td class="border border-gray-300 p-2 {header === 'Who' || header === 'For' ? 'min-w-[150px]' : ''}">
              {#if header === "Who"}
                  <Select
                  class="w-full"
                  items={$members.map(member => ({ value: member, label: member }))}
                  value={row.Who}
                  on:change={(event: CustomEvent<formSelectType>) => handleSelectWhoChange(event, i)}
                  on:clear={(event: CustomEvent<formSelectType>) => handleSelectWhoChange(event, i)}
                  />
                {:else if header === "For"}
                    <Select
                      class="w-full"
                      items={[{ value: 'ALL', label: 'ALL' }, ...$members.map(member => ({ value: member, label: member }))]}
                      value={row.For}
                      multiple={true}
                      on:change={(event: CustomEvent<formSelectType[]>) => handleMultiSelectChange(event, i)}
                      on:clear={(event: CustomEvent<formSelectType[]>) => handleSelectRemove(event, i)}
                    />
                {:else if header === "Paid"}
                    <div class="flex items-center">
                      <span class="mr-2">Rp.</span>
                      <input class="w-full p-1" type="number" bind:value={row[header]} placeholder={header} />
                    </div>
                  {:else if header === "Price"}
                    <div class="flex items-center">
                      <span class="w-full p-1">{row[header]}</span>
                    </div>
                  {:else}
                    <input class="w-full p-1" bind:value={row[header]} placeholder={header} />
                {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  
  <Button label="Add New Expenses" onClick={addRow} />
  <Button label="Calculate Debt" onClick={calculateDebt} />
</main>