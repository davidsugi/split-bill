<script lang="ts">
  import MemberIcon from "./MemberIcon.svelte";

  export let text = 'Member';
</script>

<div class="flex items-center">
 <MemberIcon {text} />
 <span class="ml-2">{text}</span>
</div>