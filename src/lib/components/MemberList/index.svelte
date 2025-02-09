<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import TextArea from '$lib/components/common/TextArea.svelte';
    import MemberComponent from '$lib/components/MemberList/MemberComponent.svelte';
    import { members, rows, textValue } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS } from '$lib/types/index.js';
    import localStorage from '$lib/utils/localStorage.js';
    import { onMount } from 'svelte';

    const { load, save } = localStorage;

    onMount(() => {
        const savedTextValue = load(LOCAL_STORAGE_KEYS.memberList);
        if (savedTextValue) {
            textValue.set(savedTextValue);
            processInput();
        }
    });

    function processInput(): void {
      textValue.update(value => {
        console.log('Input value:', value);
        members.set(value.split(',').map(member => member.trim()));
        console.log('Members:', members);
        save(LOCAL_STORAGE_KEYS.memberList, value);
        return value;
      });
    }

    function clearInput(): void {
        textValue.set('');
        members.set([]);
        rows.set([]);
        save(LOCAL_STORAGE_KEYS.memberList, '');
        save(LOCAL_STORAGE_KEYS.rows, '');
    }
</script>
  
<main class="container mx-auto p-4">
  <TextArea placeholder="Type all the member separated with comma..." bind:value={$textValue} />
  <Button label="Add All Member" onClick={processInput} />
  {#if $members.length > 0}
    <Button label="Clear All Member" onClick={clearInput} />
  {/if}    
  <MemberComponent />
</main>