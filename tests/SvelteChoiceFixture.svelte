<script lang="ts">
  import { Radio, RadioGroup, Checkbox, CheckboxGroup } from '../packages/svelte/src';
  let { disabled=false, required=true, onValueChange=(_:string[])=>{} }: { disabled?:boolean; required?:boolean; onValueChange?:(value:string[])=>void }=$props();
  let checked=$state(false);let mode=$state('survival');let rules=$state<string[]>([]);
  const options=[{value:'survival',label:'Survival'},{value:'spectator',label:'Spectator',disabled:true},{value:'creative',label:'Creative'}];
</script>
<form aria-label="World settings">
  <Radio label="Steve" name="skin" value="steve" defaultChecked/>
  <Radio label="Alex" name="skin" value="alex"/>
  <Checkbox label="Accept" name="accept" value="yes" bind:checked/>
  <Checkbox label="Mixed" indeterminate checked={false}/>
  <fieldset {disabled}>
    <RadioGroup {options} name="mode" label="Mode" bind:value={mode} {required}/>
    <CheckboxGroup {options} name="rules" label="Rules" bind:value={rules} {onValueChange} {required}/>
  </fieldset>
  <output aria-label="Checked value">{String(checked)}</output>
  <output aria-label="Mode value">{mode}</output>
  <output aria-label="Rules value">{rules.join(',')}</output>
</form>
