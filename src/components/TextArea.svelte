<script>
  export let placeholder = 'Enter text here...';
  export let value = '';
</script>

<textarea
  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  bind:value
  placeholder={placeholder}
></textarea>
