import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Select, Button, buttonSizes, buttonVariants, type SelectItem, type ButtonOptions } from '@ore-ui/react';
import { Box, ChevronRight, Copy, Check, RotateCcw, SlidersHorizontal, Accessibility, ListFilter, ArrowRight } from 'lucide-react';
const options: SelectItem[] = [
  { label: 'Survival', value: 'survival' },
  { label: 'Creative', value: 'creative' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Spectator', value: 'spectator', disabled: true },
];
function CopySource({ source }: { source: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <button className="icon-button" aria-label={copied ? 'Copied' : 'Copy Select code'} onClick={async()=>{
    try { await navigator.clipboard.writeText(source); setCopied(true); clearTimeout(timer.current); timer.current = setTimeout(()=>setCopied(false), 1800); }
    catch { setCopied(false); }
  }}>{copied ? <Check size={15}/> : <Copy size={15}/>}</button>;
}
export default function SelectDemo({ framework, onFrameworkChange }: { framework: 'React' | 'Svelte'; onFrameworkChange: (framework: 'React' | 'Svelte') => void }) {
  const [value, setValue] = useState('survival');
  const [variant, setVariant] = useState<NonNullable<ButtonOptions['variant']>>('general');
  const [size, setSize] = useState<NonNullable<ButtonOptions['size']>>('md');
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [tab, setTab] = useState('Overview');
  const [submitted, setSubmitted] = useState('');
  const codeOptions = `const options = [\n  { label: 'Survival', value: 'survival' },\n  { label: 'Creative', value: 'creative' },\n  { label: 'Adventure', value: 'adventure' },\n  { label: 'Spectator', value: 'spectator', disabled: true },\n];`;
  const attributes = `${showLabel ? 'label="Game mode"' : 'aria-label="Game mode"'} variant="${variant}" size="${size}"${disabled ? ' disabled' : ''}${invalid ? ' invalid' : ''}`;
  const source = framework === 'React'
    ? `import { Select } from '@ore-ui/react';\nimport { useState } from 'react';\nimport '@ore-ui/react/styles.css';\nimport '@ore-ui/react/fonts.css';\n\n${codeOptions}\n\nexport function Demo() {\n  const [value, setValue] = useState('survival');\n  return (\n    <Select options={options} value={value}\n      onValueChange={setValue}\n      ${attributes} />\n  );\n}`
    : `<script>\n  import { Select } from '@ore-ui/svelte';\n  import '@ore-ui/svelte/styles.css';\n  import '@ore-ui/svelte/fonts.css';\n  let value = $state('survival');\n  ${codeOptions.replaceAll('\n', '\n  ')}\n</script>\n\n<Select {options} bind:value\n  ${attributes} />`;
  function reset() { setValue('survival'); setVariant('general'); setSize('md'); setDisabled(false); setInvalid(false); setShowLabel(true); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); setSubmitted(String(data.get('world-type'))); }
  return <main id="select">
    <div className="breadcrumb">Components <ChevronRight size={13}/><span>Inputs</span><ChevronRight size={13}/><strong>Select</strong></div>
    <div className="hero"><div className="component-icon"><ListFilter size={28} strokeWidth={1.5}/></div><div className="hero-title"><h1>Select</h1><span className="status-badge"><span/>Minecraft Ore UI</span></div><p>Every world starts with a choice.<br/>A tactile dropdown with a keyboard-friendly inventory.</p><div className="hero-meta"><span><Box size={13}/>@ore-ui/{framework.toLowerCase()}</span><span className="meta-divider"/><span><Accessibility size={14}/>Accessible single selection</span></div></div>
    <div className="page-tabs" role="tablist" aria-label="Select documentation">{['Overview', 'API'].map(item=><button key={item} role="tab" id={`select-tab-${item}`} aria-controls={`select-panel-${item}`} aria-selected={tab === item} tabIndex={tab === item ? 0 : -1} className={tab === item ? 'active' : ''} onClick={()=>setTab(item)} onKeyDown={event=>{ if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) { event.preventDefault(); const next=event.key==='Home'?'Overview':event.key==='End'?'API':tab==='Overview'?'API':'Overview';setTab(next);document.getElementById(`select-tab-${next}`)?.focus(); } }}>{item}</button>)}<div className="framework-picker">{(['React','Svelte'] as const).map(f=><button key={f} aria-pressed={framework===f} className={framework===f?'selected':''} onClick={()=>onFrameworkChange(f)}>{f}</button>)}</div></div>
    <div role="tabpanel" id={`select-panel-${tab}`} aria-labelledby={`select-tab-${tab}`}>
      {tab==='Overview'?<>
        <section id="select-playground"><div className="section-heading"><h2>Pick your next adventure</h2><span>One choice. A whole new world.</span></div>
          <div className="playground select-playground"><div className="playground-main"><div className="preview-toolbar"><span><span className="live-dot"/>LIVE PREVIEW</span><button className="text-button" onClick={reset}><RotateCcw size={12}/>Reset</button></div><div className="preview-stage select-stage"><div className="select-live"><Select label={showLabel ? 'Game mode' : undefined} aria-label="Game mode" options={options} value={value} onValueChange={setValue} variant={variant} size={size} disabled={disabled} invalid={invalid}/></div><span className="preview-caption" aria-live="polite">Selected: {value || 'nothing yet'}</span></div></div>
          <div className="controls"><div className="controls-heading"><SlidersHorizontal size={14}/><span>Playground</span></div><label className="control-label" htmlFor="select-variant">Variant</label><div className="select-wrap"><select id="select-variant" value={variant} onChange={e=>setVariant(e.target.value as typeof variant)}>{buttonVariants.map(v=><option key={v}>{v}</option>)}</select></div><label className="control-label" htmlFor="select-size">Size</label><div className="select-wrap"><select id="select-size" value={size} onChange={e=>setSize(e.target.value as typeof size)}>{buttonSizes.map(s=><option key={s}>{s}</option>)}</select></div><div className="source-note">Spectator is disabled. Try Arrow keys, Home, End, or type a mode.</div><div className="toggle-list">{[{name:'Show label',value:showLabel,set:setShowLabel},{name:'Disabled',value:disabled,set:setDisabled},{name:'Invalid',value:invalid,set:setInvalid}].map(toggle=><label key={toggle.name} className="toggle-row"><span>{toggle.name}</span><input type="checkbox" checked={toggle.value} onChange={e=>toggle.set(e.target.checked)}/><span className="switch"/></label>)}</div><button className="select-clear" onClick={()=>setValue('')}>Clear selection <RotateCcw size={11}/></button></div>
          <div className="code-panel"><div className="code-toolbar"><span>{framework==='React'?'SelectDemo.tsx':'SelectDemo.svelte'}</span><CopySource source={source}/></div><pre><code>{source}</code></pre></div></div>
        </section>
        <section className="lower-section" id="select-examples"><div className="section-heading"><h2>A place for every choice</h2><span>Native form behavior. Custom appearance.</span></div><div className="select-examples"><div className="select-example-card"><span className="eyebrow">START WITH A QUESTION</span><Select label="World preset" placeholder="Choose a preset" options={[{value:'default',label:'Default'},{value:'flat',label:'Superflat'},{value:'amplified',label:'Amplified'}]} fullWidth/><p className="muted small">A placeholder stays visible until a choice is made.</p></div><div className="select-example-card"><span className="eyebrow">NOT AVAILABLE YET</span><Select label="Difficulty" defaultValue="hardcore" options={[{value:'hardcore',label:'Hardcore'}]} disabled fullWidth/><p className="muted small">Disabled fields stay out of the keyboard tab order.</p></div></div></section>
        <section className="lower-section" id="select-form"><div className="section-heading"><h2>Ready for your forms</h2><span>Choose. Submit. Reset.</span></div><form className="select-form" onSubmit={submit} onReset={()=>setSubmitted('')}><Select options={[{value:'infinite',label:'Infinite'},{value:'flat',label:'Flat'},{value:'old',label:'Old world'}]} label="World type" name="world-type" defaultValue="infinite" required/><div className="select-form-actions"><Button type="submit" size="sm">Create world</Button><Button type="reset" size="sm" variant="general">Reset</Button></div><p className="muted small" aria-live="polite">{submitted?`Submitted world-type: ${submitted}`:'The selected value is included in FormData.'}</p></form></section>
        <section className="accessibility-note"><Accessibility size={20}/><div><h3>Leave the mouse in your inventory.</h3><p>Arrow keys navigate, Home / End jump to the edges, typing finds a match, Enter confirms, Escape closes, and focus returns to the trigger. Disabled options are skipped.</p></div></section>
      </>:<section className="detail-panel"><h2>Select API</h2><p>A single string value in both frameworks. Use value + onValueChange in React, or bind:value in Svelte. defaultValue supports uncontrolled use.</p><div className="table-scroll"><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>{[['options','SelectItem[]','required'],['value','string','uncontrolled'],['defaultValue','string','empty'],['onValueChange','(value: string) => void','—'],['label / aria-label','string','placeholder'],['placeholder','string','Select an option'],['variant',buttonVariants.join(' | '),'general'],['size',buttonSizes.join(' | '),'md'],['disabled / required / invalid','boolean','false'],['name / form / id','string','—'],['fullWidth / unstyled','boolean','false'],['ref','HTMLButtonElement','—']].map(row=><tr key={row[0]}>{row.map((cell,i)=><td key={i}>{i===0?<code>{cell}</code>:cell}</td>)}</tr>)}</tbody></table></div></section>}
    </div>
    <footer><span className="brand-footer">ore ui.</span><span>Built in blocks. Made to be selected.</span><a href="#button">Explore Button <ArrowRight size={11}/></a></footer>
  </main>;
}
