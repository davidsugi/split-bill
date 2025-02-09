<script lang="ts">
    import '../app.css';
    import TextArea from '../lib/components/TextArea.svelte';
    import Button from '../lib/components/Button.svelte';
    import Select from 'svelte-select';
    import { onMount } from 'svelte';
    import { roundCurrency } from '../lib/utils/currencyUtils.js';

    type formSelectType = {
        value: string;
        label: string;
    }

    let textValue: string = '';
    let members: string[] = []; 
    let debtInfo: { [key: string]: { totalDebt: number, owes: { [key: string]: number }, shouldCollect: { [key: string]: number } } } = {};

    onMount(() => {
        const savedTextValue = localStorage.getItem('textValue');
        if (savedTextValue) {
            textValue = savedTextValue;
            processInput();
        }
    });

    function processInput(): void {
      console.log('Input value:', textValue);
      members = textValue.split(',').map(member => member.trim());
      console.log('Members:', members);
      localStorage.setItem('textValue', textValue);
      // Add your processing logic here
    }

    let headers: string[] = ['Who', 'Paid', 'What', 'For'];
    type Row = {
        [key: string]: undefined | formSelectType | string | number | formSelectType[];
        Who: formSelectType | undefined;
        Paid: number;
        What: string;
        For: formSelectType[];
    };

    let rows: Row[] = [{ Who: undefined, Paid: 0, What: '', For: [] }];

    function addRow(): void {
        rows = [...rows, { Who: undefined, Paid: 0, What: '', For: [] }];
    }

    function handleMultiSelectChange(event: CustomEvent<formSelectType[]>, rowIndex: number): void {
        const selectedOptions = event.detail;
        const haveAll = selectedOptions.some((forOption) => forOption.value === 'ALL');
        if (haveAll) {
            rows[rowIndex].For = members.map(member => ({ label: member, value: member }));
        } else {
            rows[rowIndex].For = selectedOptions;
        }
    }

    function handleMultiSelectRemove(event: CustomEvent<formSelectType[]|formSelectType>, rowIndex: number): void {
        const selectedOptions = event.detail;
        if(Array.isArray(selectedOptions)) {
            rows[rowIndex].For = [];
            return
        }
        rows[rowIndex].For = rows[rowIndex].For.filter((forOption) => forOption.value !== selectedOptions.value);
    }

    function handleSelectWhoChange(event: CustomEvent<formSelectType>, rowIndex: number): void {
        const selectedOptions = event.detail;
        rows[rowIndex].Who = selectedOptions;
    }

    function calculateDebt(): void {
        debtInfo = {};
        members.forEach(member => {
            debtInfo[member] = {
                totalDebt: 0,
                owes: {},
                shouldCollect: {}
            };
        });

        rows.forEach(row => {
            const lender = row.Who?.value || "none";
            const amount = row.Paid;
            const borrowers = row.For;
            const splitAmount = roundCurrency(amount / borrowers.length);
            
            borrowers.forEach(borrower => {
                if (borrower.value !== lender) {
                    debtInfo[borrower.value].totalDebt += splitAmount;
                    debtInfo[borrower.value].owes[lender] = (debtInfo[borrower.value].owes[lender] || 0) + splitAmount;
                    debtInfo[lender].shouldCollect[borrower.value] = (debtInfo[lender].shouldCollect[borrower.value] || 0) + splitAmount - debtInfo[borrower.value].owes[lender];
                }
            });
        });
        console.log(debtInfo);
    }
</script>
  
<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold text-blue-600">Bayar Dewe Dewe</h1>
  <p class="mt-4 text-gray-700">Easy split bill apps with 100% data privacy, all data stored in user's device.</p>
  <br />
  <TextArea placeholder="Type all the member separated with comma..." bind:value={textValue} />
  <Button label="Add All Member" onClick={processInput} />
  
  {#if members.length > 0}
    <p class="mt-4 text-gray-500">
        Members:
    </p>
    <ul class="mt-4 list-disc list-inside">   
      {#each members as member}
        <li>{member}</li>
      {/each}
    </ul>    
    
    <table class="mt-4 border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          {#each headers as header}
            <th class="border border-gray-300 p-2">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row, i}
          <tr>
            {#each headers as header}
              <td class="border border-gray-300 p-2 {header === 'Who' || header === 'For' ? 'min-w-[150px]' : ''}">
                {#if header === "Who"}
                    <Select
                    class="w-full"
                    items={members.map(member => ({ value: member, label: member }))}
                    value={rows[i].Who}
                    on:change={(event: CustomEvent<formSelectType>) => handleSelectWhoChange(event, i)}
                    />
                  {:else if header === "For"}
                      <Select
                        class="w-full"
                        items={[{ value: 'ALL', label: 'ALL' }, ...members.map(member => ({ value: member, label: member }))]}
                        value={rows[i].For}
                        multiple={true}
                        on:change={(event: CustomEvent<formSelectType[]>) => handleMultiSelectChange(event, i)}
                        on:clear={(event: CustomEvent<formSelectType[]>) => handleMultiSelectRemove(event, i)}
                      />
                  {:else if header === "Paid"}
                      <div class="flex items-center">
                        <span class="mr-2">Rp.</span>
                        <input class="w-full p-1" type="number" bind:value={row[header]} placeholder={header} />
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

    {#if Object.keys(debtInfo).length > 0}
      <div class="mt-8">
        <h2 class="text-2xl font-bold">Debt Information</h2>
        {#each Object.keys(debtInfo) as member}
          <div class="mt-4">
            <h3 class="text-xl font-semibold">{member}</h3>
            <p>Total Debt: Rp. {debtInfo[member].totalDebt}</p>
            <h4 class="font-semibold">Owes:</h4>
            <ul class="list-disc list-inside">
              {#each Object.keys(debtInfo[member].owes) as lender}
                <li>{lender}: Rp. {debtInfo[member].owes[lender]}</li>
              {/each}
            </ul>
            <h4 class="font-semibold">Should Collect:</h4>
            <ul class="list-disc list-inside">
              {#each Object.keys(debtInfo[member].shouldCollect) as borrower}
                <li>{borrower}: Rp. {debtInfo[member].shouldCollect[borrower]}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</main>