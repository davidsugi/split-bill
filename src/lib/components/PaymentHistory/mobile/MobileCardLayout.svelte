<script lang="ts">
  import Card from '$lib/components/common/Card.svelte';
  import { members, rows } from '$lib/stores.js';
  import type { formSelectType } from '$lib/types/index.js';
  import IconifyIcon from "@iconify/svelte";
  import Select from 'svelte-select';
  import type { Writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { clickOutside } from '$lib/utils/clickOutside.js';

  export let handleSelectWhoChange, handleMultiSelectChange, handleSelectRemove, deleteRow;
  export let editMode: Writable<boolean[]>;

  function toggleEditMode(index: number) {
    editMode.update(modes => {
      modes[index] = !modes[index];
      return modes;
    });
  }

  function handleClickOutside(index: number) {
    if ($editMode[index]) {
      toggleEditMode(index);
    }
  }

  onMount(() => {
    $rows.forEach((_, index) => {
      clickOutside(`card-${index}`, () => handleClickOutside(index));
    });
  });
</script>

{#each $rows as row, i}
  <Card id={`card-${i}`}>
    <div class="p-4 relative">
      <button class="absolute top-2 right-2" on:click={() => toggleEditMode(i)}>
        {#if $editMode[i]}
          <IconifyIcon class="grey-icon" icon="fa6-regular:floppy-disk"/>
        {:else}
          <IconifyIcon class="grey-icon"icon="fa6-regular:pen-to-square" />
        {/if}
      </button>
      <button class="absolute top-10 right-3" on:click={() => deleteRow(i)}>
        <IconifyIcon class="red-icon" icon="fa6-regular:trash-can" />
      </button>
      {#if $editMode[i]}
        <!-- Edit Mode -->
        <div class="mb-2">
          <label class="block text-gray-700" for="who-{i}">Who</label>
          <Select
            id="who-{i}"
            class="w-full"
            items={$members.map(member => ({ value: member, label: member }))}
            value={row.Who}
            on:change={(event: CustomEvent<formSelectType>) => handleSelectWhoChange(event, i)}
            on:clear={(event: CustomEvent<formSelectType>) => handleSelectWhoChange(event, i)}
          />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700" for="paid-{i}">Paid</label>
          <div class="flex items-center">
            <span class="mr-2">Rp.</span>
            <input id="paid-{i}" class="w-full p-1" type="number" bind:value={row.Paid} placeholder="Paid" />
          </div>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700"  for="what-{i}">What</label>
          <input class="w-full p-1" bind:value={row.What} placeholder="What" />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700"  for="for-{i}">For</label>
          <Select
            class="w-full"
            items={[{ value: 'ALL', label: 'ALL' }, ...$members.map(member => ({ value: member, label: member }))]}
            value={row.For}
            multiple={true}
            on:change={(event: CustomEvent<formSelectType[]>) => handleMultiSelectChange(event, i)}
            on:clear={(event: CustomEvent<formSelectType[]>) => handleSelectRemove(event, i)}
          />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700"  for="price-{i}">Price</label>
          <div class="flex items-center">
            <span class="w-full p-1">{row.Price}</span>
          </div>
        </div>
      {:else}
        <!-- Display Mode -->
        <div class="mb-2">
          <label class="block text-gray-700" for="display-who-{i}">Who</label>
          <span>{row.Who?.label}</span>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700" for="display-paid-{i}">Paid</label>
          <div class="flex items-center">
            <span class="mr-2">Rp.</span>
            <span>{row.Paid}</span>
          </div>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700" for="display-what-{i}">What</label>
          <span>{row.What}</span>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700" for="display-for-{i}">For</label>
          <span>{row.For.map((item) => item.label).join(', ')}</span>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700" for="display-price-{i}">Price</label>
          <div class="flex items-center">
            <span class="w-full p-1">{row.Price}</span>
          </div>
        </div>
      {/if}
    </div>
  </Card>
{/each}
