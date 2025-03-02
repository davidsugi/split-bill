<script lang="ts">
    import DebtList from '$lib/components/DebtList/index.svelte';
    import MemberList from '$lib/components/MemberList/index.svelte';
    import PaymentHistory from '$lib/components/PaymentHistory/index.svelte';
    import { members } from '$lib/stores.js';
    import '../app.css';
    import Tesseract from '$lib/components/Tesseract/index.svelte'
    import Media from '$lib/components/Media/index.svelte'
</script>
<div class="bg-blue-600 lg:bg-white sticky shadow">
  <h1 class="container mx-auto p-4 text-3xl font-bold text-white lg:text-blue-600">Bayar Dewe Dewe</h1>
</div>
<main class="container mx-auto p-4">
  <p class="mt-4 text-gray-700">Easy split bill apps with 100% data privacy, all data stored in user's device.</p>

  <br />
  <MemberList />
  <Media />
  <Tesseract />
  {#if $members.length > 0}  
    <PaymentHistory />
    <DebtList />
  {/if}
</main>