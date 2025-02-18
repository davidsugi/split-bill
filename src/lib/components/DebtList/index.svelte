<script lang="ts">
    import MemberChips from '$lib/components/common/MemberChips.svelte';
    import { debtInfo } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS } from '$lib/types/index.js';
    import localStorage from '$lib/utils/localStorage.js';
    import { onMount } from 'svelte';

    const { load } = localStorage;

    onMount(() => {
        const savedTextValue = load(LOCAL_STORAGE_KEYS.debtInfo);
        if (savedTextValue) {
            loadState();
        }
    });

    function loadState(): void {
        const savedRows = load(LOCAL_STORAGE_KEYS.debtInfo);
        if (savedRows) {
            debtInfo.set(JSON.parse(savedRows));
        }
        console.log("DEBTINFO", $debtInfo)
    }
</script>
  
<main class="container mx-auto p-4">
    {#if Object.keys($debtInfo).length > 0}
    <div class="mt-8">
      <h2 class="text-2xl font-bold">Debt Information</h2>
      {#each Object.keys($debtInfo) as member}
        <div class="mt-4">
          <h3 class="text-xl font-semibold"><MemberChips text={member} /></h3>
          <p>Total Debt: Rp. {$debtInfo[member].totalDebt}</p>
          <h4 class="font-semibold">Owes:</h4>
          <ul class="list-disc list-inside">
            {#each Object.keys($debtInfo[member].owes) as lender}
              <li>{lender}: Rp. {$debtInfo[member].owes[lender]}</li>
            {/each}
          </ul>
          <h4 class="font-semibold">Should Collect:</h4>
          <ul class="list-disc list-inside">
            {#each Object.keys($debtInfo[member].shouldCollect) as borrower}
              <li>{borrower}: Rp. {$debtInfo[member].shouldCollect[borrower]}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  {/if}
</main>