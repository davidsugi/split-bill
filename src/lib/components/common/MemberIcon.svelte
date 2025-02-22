<script lang="ts">
  import { getAsciiVal } from "$lib/utils/ascii.js";
  import { fetchPokemon } from "$lib/utils/pokeApi.js";

  export let text = 'Member';
  let image: string | undefined = undefined;
  async function loadPokemonIcons() {
     image = (await fetchPokemon(getAsciiVal(text))) ?? undefined;
  }

  $: if (text !== 'Member') {
    loadPokemonIcons();
  }
</script>

  {#if image }
    <div class="w-8 h-8 rounded-full overflow-hidden ">
      <img src={image} class="object-cover object-top transform translate-1 scale-200" alt="member-icon" />
    </div>
  {:else}
    <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
  {/if}