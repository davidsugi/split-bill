<script lang="ts">
  import { rows, members } from '$lib/stores.js';
  import Select from 'svelte-select';
  import type { formSelectType } from '$lib/types/index.js';
  import IconifyIcon from "@iconify/svelte";
  import { formatCurrency } from '$lib/utils/currencyUtils.js';

  export let totalAmount, handleSelectWhoChange, handleMultiSelectChange, handleSelectRemove, deleteRow;
</script>

<table class="mt-4 border-collapse border border-gray-300 w-full">
  <thead>
    <tr>
      {#each ['Who', 'Paid', 'What', 'For', 'Price', 'Actions'] as header}
        <th class="border border-gray-300 p-2">{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each $rows as row, i}
      <tr>
        {#each ['Who', 'Paid', 'What', 'For', 'Price'] as header}
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
                    <span class="w-full p-1">{formatCurrency(row[header])}</span>
                  </div>
                {:else}
                  <input class="w-full p-1" bind:value={row[header]} placeholder={header} />
              {/if}
          </td>
        {/each}
        <td class="border border-gray-300 p-2">
          <button on:click={() => deleteRow(i)}>
            <IconifyIcon class="grey-icon" icon="fa6-regular:trash-can" />
          </button>
        </td>
      </tr>
    {/each}
    <tr><td colspan="4" class="border border-gray-300 p-2 right-align">Total:</td><td class="border border-gray-300 p-2">{totalAmount}</td></tr>
  </tbody>
</table>
