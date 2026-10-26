# Ore UI

Minecraft Ore UI 风格的 React / Svelte 双入口 UI 组件库。样式、设计 tokens、组件配置和 DOM 动画共享，框架层只负责渲染、事件和 refs。演示站使用 React + Vite，参考 Mantine 的参数面板与实时示例代码布局。

## 开发

要求 Node.js 22.12+、pnpm 10。

```sh
pnpm install
pnpm dev          # 先构建两个库，再启动演示站
pnpm verify       # 库构建 → 类型检查 → 测试 → 演示站生产构建
pnpm build        # 构建两个库和演示站
```

修改库源码后，重新运行 `pnpm build:libs` 更新演示站使用的产物。修改演示站本身支持 Vite HMR。

## 目录

```text
packages/core/      私有共享核心：CSS tokens、Button recipe、DOM motion
packages/react/     对外入口 @ore-ui/react
packages/svelte/    对外入口 @ore-ui/svelte（Svelte 5）
apps/docs/          React 交互演示站
scripts/           构建时复用共享源码、复制共享样式
tests/             React / Svelte 行为与 reduced-motion 测试
```

只有 React / Svelte 两个包对外发布。core 是 private workspace 包；React 将其源码打入 JS 和类型声明，Svelte 打包前将其拷贝到临时输入目录。生成的库不依赖任何私有 workspace 包。样式在构建时复制，不在两个框架中手工维护。

## React

```tsx
import { Button } from '@ore-ui/react';
import '@ore-ui/react/styles.css';

<Button variant="colored" size="md">
  Get started
</Button>
```

React 18 / 19。支持原生 button 属性、事件和 forwardRef；`type` 默认是 `button`，表单提交需显式指定 `type="submit"`。

## Svelte

```svelte
<script>
  import { Button } from '@ore-ui/svelte';
  import '@ore-ui/svelte/styles.css';
</script>

<Button variant="colored" onclick={() => console.log('clicked')}>
  Get started
</Button>
```

支持 Svelte 5.20+ snippet children、原生事件、class 字符串/数组/对象，以及 `bind:ref`。两个适配器共享 `variant`、`size`、`loading`、`disabled`、`fullWidth`、`unstyled` API。

## 样式与 Figma 接入

样式采用原生 CSS + CSS variables + cascade layers，不绑定 CSS-in-JS、Tailwind 或特定框架。`data-*` 属性是样式与框架适配器之间的稳定契约。应用的普通 CSS 可覆盖库的 layer 默认值；也可以设置 `unstyled` 完全接管视觉样式（loading 状态也需自行提供）。

```css
/* 应用样式，位于库样式之后 */
:root {
  --ore-colored-background: #387e24;
  --ore-colored-hover: #275b1a;
  --ore-colored-pressed: #1c4a12;
  --ore-font: 'Your font', sans-serif;
}
.checkout-button {
  --ore-unit: 2px;
  --ore-button-padding: 24px;
}
```

后续 Figma 的颜色、字体、边框和立体深度映射到 `packages/core/src/styles.css`；状态与 variant 规则也在此处更新，React / Svelte 无需各写一份。React 使用 `className`，Svelte 使用 `class`。

## 动画策略

- 普通按钮按压：外层点击区域固定，内层表面下沉 3 个像素单位，立体底边消失。指针交互使用 160ms transform transition；键盘按下立即切换状态，reduced-motion 下不移动。此时长是实现选择，设计文件没有提供关键帧轨道。
- 弹簧 / 非线性位移：使用 Motion 的框架无关 `animate` API；独立 `./motion` 子入口，普通 Button 不引入动画运行时代码。
- 位移应用于外层 wrapper，按钮按压作用于内层，避免争用 `transform`。
- `springTo` 支持反复改变目标、取消与卸载清理。reduced-motion 下保持静止。模块可在 SSR 中导入；调用需要已挂载的 DOM。
- 未来复杂拖拽、布局动画或退出动画应增加共享 DOM controller，再由框架生命周期挂载 / 清理；不在 React 和 Svelte 各维护一套动画引擎。

```tsx
import { springTo } from '@ore-ui/react/motion'; // Svelte: @ore-ui/svelte/motion

const stop = springTo(wrapperElement, 76, 0);
// effect cleanup / onDestroy:
stop();
```

Motion 参考：[框架无关 animate](https://motion.dev/docs/animate)。Svelte 发布结构遵循[官方 packaging 指南](https://svelte.dev/docs/kit/packaging)。

## 独立安装与发布

目前包名仅为项目配置，尚未发布到 npm；实际发布前确认 scope 可用性，并补充你选择的 LICENSE、仓库与作者信息。

```sh
pnpm build:libs
pnpm --filter @ore-ui/react pack --pack-destination ../../artifacts
pnpm --filter @ore-ui/svelte pack --pack-destination ../../artifacts
# 在其他项目中安装生成的 tgz，无需安装 @ore-ui/core
pnpm add /absolute/path/to/artifacts/ore-ui-react-0.1.0.tgz
```

产物含 JS、类型声明和显式 `styles.css` 导出。Svelte 额外保留可编译的 `.svelte` 文件与 `svelte` export condition。开发工具、演示站和共享私有包均不发布。两种样式内容相同，在同时使用两个库的应用中只导入其中一份样式。

## Minecraft Button 设计对照

来源：[Button 组件集](https://www.figma.com/design/XAEZlcgBRTwyL5EvAVWdV3/?node-id=425-8428)。

- `variant` 改为 `colored | general | destructive | warning | realms`；移除 init 阶段占位的 `color` / `radius` 和四种通用变体。此时尚未发布 npm，因此直接统一为设计稿语义。
- `xs / sm / md / lg / xl` 为源组件 25% / 37.5% / 50% / 75% / 100% 比例；`xl` 对应 105px 外框、89px 表面、36px 字体、4px 描边、8px 底边，按下表面下沉 12px。宽度按内容自适应，可通过原生 `style` / `className` / `class` 控制，`fullWidth` 填满父容器。
- Figma 的 default / hovered / focused / pressed / disabled 映射到原生 CSS 状态；组合状态自然叠加。静态状态展示仅存在演示站，库没有允许伪造交互状态的公共 prop。
- 可选 `import '@ore-ui/react/fonts.css'`（或 Svelte 对应路径）注册 Minecraft Seven v2。也可提供自己的 `--ore-font`。
- Loading 方块与缩放档位是库的扩展，未声称来自 Figma 原稿。当前实现横向文字与任意 children 图标；纵向内容布局尚未实现。
- 设计稿与字体的来源、署名及发布前字体权限检查见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

## Select 单选下拉

两端共用 Zag Select 状态机和 CSS；只在适配器中处理 React / Svelte 的渲染与生命周期。Select 默认 `variant="general"`，支持 Button 的五种配色和尺寸。

```tsx
import { Select } from '@ore-ui/react';
import '@ore-ui/react/styles.css';
import '@ore-ui/react/fonts.css'; // 可选字体

const options = [
  { value: 'survival', label: 'Survival' },
  { value: 'creative', label: 'Creative' },
  { value: 'spectator', label: 'Spectator', disabled: true },
];

<Select label="Game mode" options={options} name="mode"
  defaultValue="survival" onValueChange={value => console.log(value)} />
```

Svelte 的导入路径为 `@ore-ui/svelte`，可用 `<Select {options} label="Game mode" bind:value />`。React 的受控写法为 `value={value} onValueChange={setValue}`。回调参数和绑定值均为单个字符串；空字符串表示清空，option 的 value 必须唯一且非空。

包含键盘方向键、Home/End、typeahead、Enter、Escape、禁用选项、表单提交/重置、可见 label、`aria-label` / `aria-describedby`、required/invalid、ref、portal 定位与视口避让。演示页从左侧 Select 入口访问，也可直接打开 `/#select`。

下拉样式沿用已经确认的 MC tokens；本阶段 Figma 配额未恢复，尚未与 Select 源稿逐像素对照。设计及 API 范围见 [Select 说明](./docs/select-design.md)。

## Radio / Checkbox 与选择组

新增 `Radio`、`RadioGroup`、`Checkbox`、`CheckboxGroup`，均从两个框架的主入口导入，复用现有 `styles.css` 和可选的 `fonts.css`。

```tsx
import { Radio, RadioGroup, Checkbox, CheckboxGroup } from '@ore-ui/react';

<Radio label="Survival" name="mode" value="survival" defaultChecked />
<Checkbox label="Keep inventory" name="inventory" value="yes" defaultChecked />

<RadioGroup label="Game mode" name="mode" options={modeOptions}
  defaultValue="survival" onValueChange={value => console.log(value)} />
<CheckboxGroup label="Game rules" name="rules" options={ruleOptions}
  defaultValue={['inventory']} required onValueChange={values => console.log(values)} />
```

`options` 支持 `{ value, label, description?, disabled? }`。React 独立控件用 `checked` / `onCheckedChange`，组用 `value` / `onValueChange`；Svelte 对应 `bind:checked` 与 `bind:value`。`Checkbox` 支持 `indeterminate` 半选态。组支持 `orientation="horizontal"`、整体禁用、required、表单提交与重置，以及外部 `form` 关联。多选组 required 表示至少勾选一个可用项。

四个独立演示入口：`/#radio`、`/#radio-group`、`/#checkbox`、`/#checkbox-group`，包含受控参数、React / Svelte 代码、全选与原生表单示例。API 范围和原生语义说明见 [选择控件说明](./docs/choice-design.md)。
