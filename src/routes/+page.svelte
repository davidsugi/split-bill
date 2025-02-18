<script lang="ts">
    import DebtList from '$lib/components/DebtList/index.svelte';
    import MemberList from '$lib/components/MemberList/index.svelte';
    import PaymentHistory from '$lib/components/PaymentHistory/index.svelte';
    import { members } from '$lib/stores.js';
    import '../app.css';

</script>
  
<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold text-blue-600">Bayar Dewe Dewe</h1>
  <p class="mt-4 text-gray-700">Easy split bill apps with 100% data privacy, all data stored in user's device.</p>

  <br />
  <MemberList />
  
  {#if $members.length > 0}  
    <PaymentHistory />
    <DebtList />
  {/if}
</main>