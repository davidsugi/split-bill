<script>
  export let label = 'Button';
  export let onClick = () => {};
</script>

<button
  class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
  on:click={onClick}
>
  {label}
</button>
