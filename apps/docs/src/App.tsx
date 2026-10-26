import ChoiceDemo, { type ChoiceKind } from './ChoiceDemo';
import SelectDemo from './SelectDemo';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button, buttonVariants, buttonSizes, type ButtonOptions } from '@ore-ui/react';
import { springTo } from '@ore-ui/react/motion';
import { ArrowUpRight, ArrowRight, Check, ChevronRight, Copy, Command, Search, Moon, Sun, Box, MousePointer2, RotateCcw, SlidersHorizontal, Sparkles, Menu, X, Play, CheckCheck, Code2, Layers, Accessibility } from 'lucide-react';

type Framework = 'React' | 'Svelte';
const swatches = { colored: '#387e24', general: '#d0d1d5', destructive: '#c93636', warning: '#e1b922', realms: '#7345e5' };
const names = { colored: 'Colored', general: 'General', destructive: 'Destructive', warning: 'Warning', realms: 'Realms' };
const choicePages = ['radio', 'radio-group', 'checkbox', 'checkbox-group', 'switch'];
function currentPage() { const hash = location.hash.slice(1); return choicePages.includes(hash) ? hash : hash.startsWith('select') ? 'select' : 'button'; }
const figmaUrl = 'https://www.figma.com/design/XAEZlcgBRTwyL5EvAVWdV3/?node-id=425-8428';
const navigation = [
  { title: 'GETTING STARTED', links: [{ name: 'Introduction', href: '#introduction' }, { name: 'Installation', href: '#installation' }, { name: 'Architecture', href: '#architecture' }] },
  { title: 'COMPONENTS', links: [{ name: 'Button', href: '#button', active: true }, { name: 'Select', href: '#select', active: true }, { name: 'Radio', href: '#radio' }, { name: 'RadioGroup', href: '#radio-group' }, { name: 'Checkbox', href: '#checkbox' }, { name: 'CheckboxGroup', href: '#checkbox-group' }, { name: 'Switch', href: '#switch' }] },
  { title: 'FOUNDATIONS', links: [{ name: 'Design tokens', href: '#tokens' }, { name: 'Motion', href: '#motion' }, { name: 'Accessibility', href: '#accessibility' }] },
];
function Code({ source }: { source: string }) {
  return <pre><code>{source.split(/("[^"\n]*"|'[^'\n]*'|\b(?:import|from|export|function|return|const)\b|<\/?[A-Za-z]+|\/?>)/g).map((part, i) => <span key={i} className={/^['"]/.test(part) ? 'syntax-string' : /^(import|from|export|function|return|const)$/.test(part) ? 'syntax-keyword' : /^[<>/]/.test(part) ? 'syntax-tag' : undefined}>{part}</span>)}</code></pre>;
}
function CopyButton({ text, label = 'Copy code' }: { text: string; label?: string }) {
  const [status, setStatus] = useState('');
  useEffect(() => { if (status) { const timer = setTimeout(() => setStatus(''), 2000); return () => clearTimeout(timer); } }, [status]);
  return <button className="icon-button copy-button" aria-label={status || label} title={status || label} onClick={async () => { try { await navigator.clipboard.writeText(text); setStatus('Copied'); } catch { setStatus('Copy unavailable'); } }}>
    {status === 'Copied' ? <Check size={15} /> : <Copy size={15} />}<span aria-live="polite">{status}</span>
  </button>;
}
export default function App() {
  const [page, setPage] = useState(currentPage);
  useEffect(() => { const update = () => { setPage(currentPage()); }; window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  const [framework, setFramework] = useState<Framework>('React');
  const [tab, setTab] = useState('Overview');
  const [variant, setVariant] = useState<NonNullable<ButtonOptions['variant']>>('colored');
  const [sizeIndex, setSizeIndex] = useState(2);
  const [fullWidth, setFullWidth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withIcon, setWithIcon] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [dark, setDark] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [moved, setMoved] = useState(false);
  const motionNode = useRef<HTMLDivElement>(null);
  const motionCleanup = useRef<(() => void) | undefined>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => { document.title = `${navigation[1].links.find(link => link.href === `#${page}`)?.name ?? 'Button'} · Ore UI`; if (['#select', '#button', ...choicePages.map(p => `#${p}`)].includes(location.hash)) window.scrollTo({ top: 0 }); }, [page]);
  useEffect(() => { const handle = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); searchRef.current?.focus(); setMobileNav(true); } }; window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle); }, []);
  useEffect(() => () => motionCleanup.current?.(), []);
  const size = buttonSizes[sizeIndex];
  const iconScale = [0.25, 0.375, 0.5, 0.75, 1][sizeIndex];
  const attributes = `variant="${variant}" size="${size}"${loading ? ' loading' : ''}${disabled ? ' disabled' : ''}${fullWidth ? ' fullWidth' : ''}`;
  const iconMarkup = `<span class="button-icon"><img src="/icons/ore-button.svg" alt="" /></span>`;
  const source = framework === 'React'
    ? `import { Button } from '@ore-ui/react';\nimport '@ore-ui/react/styles.css';\nimport '@ore-ui/react/fonts.css';\n\nexport function Demo() {\n  return (\n    <Button ${attributes}>\n      ${withIcon ? '<span className="button-icon"><img src="/icons/ore-button.svg" alt="" /></span>\n      ' : ''}Label\n    </Button>\n  );\n}`
    : `<script>\n  import { Button } from '@ore-ui/svelte';\n  import '@ore-ui/svelte/styles.css';\n  import '@ore-ui/svelte/fonts.css';\n</script>\n\n<Button ${attributes}>\n  ${withIcon ? iconMarkup + '\n  ' : ''}Label\n</Button>`;
  const iconStyles = `/* Native SVG: 32 × 32. Scale the image without changing its root dimensions. */\n.button-icon { position: relative; display: inline-flex; width: ${32 * iconScale}px; height: ${32 * iconScale}px; }\n.button-icon img { position: absolute; transform: scale(${iconScale}); transform-origin: top left; }`;
  const displaySource = source + (withIcon && framework === 'Svelte' ? `\n\n<style>\n${iconStyles}\n</style>` : '');
  function reset() { setVariant('colored'); setSizeIndex(2); setFullWidth(false); setLoading(false); setDisabled(false); setWithIcon(false); setClicks(0); }
  return <>
    <header className="topbar">
      <a className="brand" href="#button" aria-label="Ore UI home"><span className="brand-mark"><Layers size={20} strokeWidth={2.3} /></span><span>ore<span className="brand-ui">ui</span><span className="brand-dot">.</span></span></a>
      <span className="version">v0.1.0 <span>alpha</span></span>
      <nav className="top-nav" aria-label="Primary"><a className="active" href="#button">Components</a><a href="#architecture">Architecture</a><a href="#tokens">Foundations</a></nav>
      <div className="top-actions"><span className="framework-note"><span />React & Svelte</span><button className="icon-button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button></div>
    </header>
    <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`} aria-label="Documentation navigation">
      <div className="search"><Search size={15} /><input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Find something…" aria-label="Search documentation"/><kbd><Command size={10} /> K</kbd></div>
      {navigation.map(group => <div className="nav-group" key={group.title}><h2>{group.title}</h2>{group.links.filter(link => link.name.toLowerCase().includes(search.toLowerCase())).map(link => <a key={link.name} href={link.href} className={link.href === `#${page}` ? 'selected' : ''} onClick={() => { setMobileNav(false); if (link.name === 'Button') setTab('Overview'); }}>{link.name === 'Button' && <MousePointer2 size={15} />}{link.name}<span>{link.href === `#${page}` && <span className="nav-dot" />}</span></a>)}</div>)}
      {search && !navigation.some(g => g.links.some(l => l.name.toLowerCase().includes(search.toLowerCase()))) && <p className="no-results">No matching sections.</p>}
      <div className="sidebar-footer"><span className="tiny-mark"><Layers size={16} /></span><div>Built in blocks.<br/><strong>Crafted to be yours.</strong></div><span className="footer-spark">✳</span></div>
    </aside>
    {choicePages.includes(page) ? <ChoiceDemo key={page} kind={page as ChoiceKind} framework={framework} onFrameworkChange={setFramework}/> : page === 'select' ? <SelectDemo framework={framework} onFrameworkChange={setFramework}/> : <main id="button">
      <div className="breadcrumb">Components <ChevronRight size={13} /><span>Inputs</span><ChevronRight size={13} /><strong>Button</strong></div>
      <div className="hero"><div className="component-icon"><MousePointer2 size={28} strokeWidth={1.5} /></div><div className="hero-title"><h1>Button</h1><span className="status-badge"><span/>Minecraft Ore UI</span></div><p>Built in blocks. Made for the web.<br className="mobile-break"/> The tactile Minecraft Ore UI button, in React and Svelte.</p><div className="hero-meta"><span><Box size={13} /> @ore-ui/{framework.toLowerCase()}</span><span className="meta-divider"/><span><Accessibility size={14}/> Accessible by default</span></div></div>
      <div className="page-tabs" role="tablist" aria-label="Button documentation">{['Overview', 'Styles', 'API'].map(item => <button key={item} role="tab" tabIndex={tab === item ? 0 : -1} onKeyDown={event => {
        const tabs = ['Overview', 'Styles', 'API'];
        const index = tabs.indexOf(item);
        const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
        if (next !== undefined) { event.preventDefault(); setTab(tabs[next]); document.getElementById(`tab-${tabs[next]}`)?.focus(); }
      }} aria-selected={tab === item} aria-controls={`panel-${item}`} id={`tab-${item}`} onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>{item}{item === 'API' && <span>9</span>}</button>)}<div className="framework-picker" aria-label="Code framework">{(['React', 'Svelte'] as const).map(f => <button key={f} aria-pressed={framework === f} onClick={() => setFramework(f)} className={framework === f ? 'selected' : ''}><span className={f === 'React' ? 'react-symbol' : 'svelte-symbol'}>{f === 'React' ? '⚛' : 'S'}</span>{f}</button>)}</div></div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
      {tab === 'Overview' ? <>
        <section className="usage-section" id="usage"><div className="section-heading"><h2>Make it yours</h2><span>Straight from the crafting table.</span></div>
          <div className="playground"><div className="playground-main"><div className="preview-toolbar"><span><span className="live-dot"/> LIVE PREVIEW</span><button className="text-button" onClick={reset}><RotateCcw size={12}/> Reset</button></div><div className="preview-stage"><div className="preview-cross cross-top"/><div className="preview-cross cross-bottom"/><div className="preview-button-wrap"><Button variant={variant} size={size} loading={loading} disabled={disabled} fullWidth={fullWidth} onClick={() => setClicks(c => c + 1)}>{withIcon && <span className="button-icon" style={{ width: 32 * iconScale, height: 32 * iconScale }}><img src="/icons/ore-button.svg" alt="" style={{ transform: `scale(${iconScale})` }}/></span>}Label</Button></div><span className="preview-caption" aria-live="polite">{clicks ? `${clicks} interaction${clicks === 1 ? '' : 's'} · feels good, right?` : 'Go on, give it a click.'}</span></div></div>
          <div className="controls"><div className="controls-heading"><SlidersHorizontal size={14}/><span>Playground</span></div><label className="control-label" htmlFor="variant">Variant <span>{variant}</span></label><div className="select-wrap"><select id="variant" value={variant} onChange={e => setVariant(e.target.value as NonNullable<ButtonOptions['variant']>)}>{buttonVariants.map(v => <option key={v} value={v}>{v[0].toUpperCase() + v.slice(1)}</option>)}</select></div>
          <div className="control-label" id="color-label">Palette <span>{names[variant]}</span></div><div className="swatches" role="group" aria-labelledby="color-label">{buttonVariants.map(v => <button key={v} aria-label={names[v]} aria-pressed={variant === v} onClick={() => setVariant(v)} className={variant === v ? 'selected' : ''} style={{ '--swatch': swatches[v] } as CSSProperties}>{variant === v && <Check size={14} strokeWidth={3}/>}</button>)}</div>
          <label className="control-label" htmlFor="size">Size <span>{size}</span></label><input className="range" id="size" aria-valuetext={size} type="range" min="0" max="4" value={sizeIndex} onChange={e => setSizeIndex(+e.target.value)} style={{'--range-progress': `${sizeIndex * 25}%`} as CSSProperties}/><div className="range-labels"><span>xs</span><span>sm</span><span>md</span><span>lg</span><span>xl</span></div>
          <div className="source-note"><Box size={12}/><span>{size === 'xl' ? 'Original Figma scale · 105px' : `${[25, 37.5, 50, 75, 100][sizeIndex]}% of the original Figma scale`}<br/>Square edges. No rounding.</span></div>
          <div className="toggle-list">{[{ label: 'Leading the way', name: 'Show icon', value: withIcon, setter: setWithIcon }, { label: '', name: 'Loading', value: loading, setter: setLoading }, { label: '', name: 'Disabled', value: disabled, setter: setDisabled }, { label: '', name: 'Full width', value: fullWidth, setter: setFullWidth }].map(toggle => <label className="toggle-row" key={toggle.name}><span>{toggle.name}</span><input type="checkbox" checked={toggle.value} onChange={e => toggle.setter(e.target.checked)}/><span className="switch"/></label>)}</div>
          </div><div className="code-panel"><div className="code-toolbar"><span><Code2 size={14}/>{framework === 'React' ? 'Demo.tsx' : 'Demo.svelte'}</span><div><span className="code-language">{framework === 'React' ? 'TSX' : 'SVELTE'}</span><CopyButton text={displaySource}/></div></div><Code source={displaySource}/>{withIcon && framework === 'React' && <><div className="code-toolbar"><span>button-icon.css</span><CopyButton text={iconStyles}/></div><Code source={iconStyles}/></>}{withIcon && <p className="icon-download">Use the <a href="/icons/ore-button.svg" download>original 32 × 32 Figma icon ↗</a> in /public/icons/ore-button.svg.</p>}</div></div>
          <div className="tip"><Sparkles size={15}/><p><strong>One design, two frameworks.</strong> The same tokens, styles, and motion. Just a different wrapper.</p><a href="#architecture" aria-label="Read about the architecture"><ArrowUpRight size={16}/></a></div>
        </section>
        <section id="variants"><div className="section-heading"><h2>Choose your material</h2><span>Five palettes from the design system.</span></div><div className="variant-grid">{buttonVariants.map(v => <div className={`variant-card ${variant === v ? 'picked' : ''}`} key={v}><div className="variant-example"><Button variant={v} size="sm" onClick={() => setVariant(v)}>Label</Button></div><button className="variant-caption" onClick={() => { setVariant(v); document.getElementById('usage')?.scrollIntoView({ block: 'start' }); }} aria-label={`Try ${v} variant`}>{names[v]}<ArrowUpRight size={13}/></button></div>)}</div></section>
        <section id="states" className="lower-section"><div className="section-heading"><h2>Every state, considered.</h2><span>Hover, focus, press. Feel the difference.</span></div><div className="state-grid">{['default', 'hovered', 'focused', 'pressed', 'disabled'].map(state => <div className="state-card" key={state}><div className="state-example" data-preview-state={state} inert><Button variant={variant} size="sm" disabled={state === 'disabled'}>Label</Button></div><span>{state[0].toUpperCase() + state.slice(1)}</span></div>)}</div><p className="muted small">Static state references above. Try the live button with your pointer, Tab, Space, or Enter.</p></section>
      </> : tab === 'Styles' ? <section className="detail-panel"><h2>A shared visual language</h2><p>Both framework adapters use the same stylesheet. Override tokens in your application, or use the unstyled prop to supply your own design.</p><Code source={"/* Import after @ore-ui/react/styles.css */\n:root {\n  --ore-colored-background: #387e24;\n  --ore-font: 'Minecraft Seven', monospace;\n}\n\n.my-button {\n  --ore-unit: 2px;\n  --ore-button-padding: 24px;\n}"}/><h3>Stable styling hooks</h3><p><code>.ore-button</code> · <code>data-variant</code> · <code>data-size</code> · <code>data-loading</code></p><p>Styles use CSS cascade layers, so your unlayered application CSS can override library defaults.</p></section> : <section className="detail-panel"><h2>Button API</h2><p>The same component options in React and Svelte. Native button attributes and events are forwarded.</p><div className="table-scroll"><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>{[['variant', buttonVariants.join(' | '), 'colored'], ['size', buttonSizes.join(' | '), 'md'], ['loading', 'boolean', 'false'], ['disabled', 'boolean', 'false'], ['fullWidth', 'boolean', 'false'], ['unstyled', 'boolean', 'false'], ['type', 'button | submit | reset', 'button'], ['children', 'ReactNode / Snippet', '—'], ['ref', 'HTMLButtonElement', '—']].map(([prop, type, def]) => <tr key={prop}><td><code>{prop}</code></td><td>{type}</td><td>{def}</td></tr>)}</tbody></table></div></section>}
      </div>
      <section id="installation" className="lower-section"><div className="section-heading"><h2>Start building</h2><span>Your next idea is one import away.</span></div><div className="install-box"><span className="terminal-sign">$</span><code>pnpm add @ore-ui/{framework.toLowerCase()}</code><CopyButton text={`pnpm add @ore-ui/${framework.toLowerCase()}`}/></div><p className="muted small">These packages are not yet published. Install the local tarballs to try them in another project.</p></section>
      <section id="motion" className="motion-section"><div><span className="eyebrow">BUILT TO FEEL RIGHT</span><h2>Room to move.</h2><p>A press sinks into the frame.<br/>Shared springs handle larger movements.</p><button className="motion-trigger" onClick={() => { if (motionNode.current) { motionCleanup.current = springTo(motionNode.current, moved ? 0 : 76, 0); setMoved(!moved); } }}><Play size={12} fill="currentColor"/>{moved ? 'Bring it back' : 'Try the spring'}<ArrowRight size={14}/></button></div><div className="motion-demo"><div className="motion-track"/><div ref={motionNode} className="motion-cube"><Layers size={26}/></div><span>Same motion. Either framework.</span></div></section>
      <section id="architecture" className="lower-section"><div className="section-heading"><h2>Less duplication. More possibility.</h2></div><p className="muted">A private core owns tokens, styling recipes, and framework-independent motion. React and Svelte add only native rendering, refs, and events. Shared code is included at build time, so each library can be installed on its own.</p><div className="architecture-flow"><span><Layers size={17}/> Shared core</span><ArrowRight size={16}/><span>React <i>+</i> Svelte</span></div></section>
      <section id="tokens" className="lower-section"><div className="section-heading"><h2>A considered palette</h2><span>Figma variables, shared by both frameworks.</span></div><div className="token-palette">{buttonVariants.map(v => <button key={v} onClick={() => { setVariant(v); setTab('Overview'); document.getElementById('button')?.scrollIntoView(); }} aria-label={`Use ${v} palette`}><span style={{background: swatches[v]}}/><strong>{names[v]}</strong><code>{swatches[v]}</code></button>)}</div></section>
      <section id="accessibility" className="accessibility-note"><CheckCheck size={20}/><div><h3>The details are part of the design.</h3><p>Native button semantics, visible keyboard focus, protected loading states, and respect for reduced motion. Give icon-only buttons an accessible label.</p></div></section>
      <footer id="introduction"><span className="brand-footer">ore ui<span>.</span></span><span>Minecraft-inspired. Built for the web.</span><a href={figmaUrl} target="_blank" rel="noreferrer">Design by Miljö AB & Turóczi Ádám ↗</a><span>Unofficial · v0.1.0</span></footer>
    </main>}
    {page === 'button' && <aside className="on-this-page"><span>ON THIS PAGE</span><a className="active" href="#usage" onClick={() => setTab('Overview')}>Playground</a><a href="#variants" onClick={() => setTab('Overview')}>Palettes</a><a href="#states" onClick={() => setTab('Overview')}>States</a><a href="#installation">Installation</a><a href="#motion">Motion</a><div className="toc-note"><span>✳</span><p>A fresh foundation<br/>for your next idea.</p><a href="#architecture">Explore the core <ArrowUpRight size={12}/></a></div></aside>}
  </>;
}
