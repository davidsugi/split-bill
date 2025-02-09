<script lang="ts">
  import { members } from '$lib/stores.js';
  import MemberChips from '$lib/components/common/MemberChips.svelte';
</script>

<main class="container mx-auto p-4">
  {#if $members.length > 0}
    <p class="mt-4 text-gray-500">
        Members:
    </p>
    <ul class="mt-4 flex flex-wrap gap-4">   
      {#each $members as member}
        <li class="bg-gray-200 px-4 py-2 rounded-3xl">
          <MemberChips text={member} />
        </li>
      {/each}
    </ul>   
  {/if}
</main>