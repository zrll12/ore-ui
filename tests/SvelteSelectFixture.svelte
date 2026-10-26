<script lang="ts">
  import Select from '../packages/svelte/src/Select.svelte';
  let { disabled=false, onValueChange=(_:string)=>{} }: { disabled?:boolean; onValueChange?:(value:string)=>void }=$props();
  let value=$state('survival');
  const options=[{value:'survival',label:'Survival'},{value:'spectator',label:'Spectator',disabled:true},{value:'creative',label:'Creative'},{value:'adventure',label:'Adventure'}];
</script>
<form aria-label="World settings">
  <Select {options} bind:value {onValueChange} label="Game mode" name="mode" {disabled}/>
  <output aria-label="Selected mode">{value}</output>
</form>
