<script lang="ts">
    import { rows } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS } from '$lib/types/index.js';
    import localStorage from '$lib/utils/localStorage.js';
    import { onMount } from 'svelte';
    import CalculateButton from './CalculateButton.svelte';
    import PaymentList from './PaymentList.svelte';

    const { load } = localStorage;

    onMount(() => {
        const savedTextValue = load(LOCAL_STORAGE_KEYS.memberList);
        if (savedTextValue) {
            loadState();
        }
    });

    function loadState(): void {
        const savedRows = load(LOCAL_STORAGE_KEYS.rows);
        if (savedRows) {
            rows.set(JSON.parse(savedRows));
        }
    }
</script>
  
  <PaymentList />
  <CalculateButton />