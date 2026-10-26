<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonAttributes, type ButtonOptions } from '@ore-ui/core';
  export interface ButtonProps extends Omit<HTMLButtonAttributes, keyof ButtonOptions>, ButtonOptions { ref?: HTMLButtonElement }
  let { variant, size, color, radius, loading = false, fullWidth, unstyled = false,
    class: className, disabled, type = 'button', children, ref = $bindable(), ...rest }: ButtonProps = $props();
</script>
<button {...rest} {...buttonAttributes({ variant, size, color, radius, loading, fullWidth })}
  bind:this={ref} {type} disabled={disabled || loading} aria-busy={loading || undefined}
  class={[unstyled ? '' : 'ore-button', className]}>
  {#if loading}<span class="ore-button__loader" aria-hidden="true"></span>{/if}
  <span class="ore-button__label">{@render children?.()}</span>
</button>
