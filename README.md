# Ore UI

React / Svelte 双入口 UI 组件库。样式、设计 tokens、组件配置和 DOM 动画共享，框架层只负责渲染、事件和 refs。演示站使用 React + Vite，参考 Mantine 的参数面板与实时示例代码布局。

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

<Button variant="filled" color="violet" size="md" radius="md">
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

<Button variant="filled" color="violet" onclick={() => console.log('clicked')}>
  Get started
</Button>
```

支持 Svelte 5 snippet children、原生事件、class 字符串/数组/对象，以及 `bind:ref`。两个适配器共享 `variant`、`color`、`size`、`radius`、`loading`、`disabled`、`fullWidth`、`unstyled` API。

## 样式与 Figma 接入

样式采用原生 CSS + CSS variables + cascade layers，不绑定 CSS-in-JS、Tailwind 或特定框架。`data-*` 属性是样式与框架适配器之间的稳定契约。应用的普通 CSS 可覆盖库的 layer 默认值；也可以设置 `unstyled` 完全接管视觉样式（loading 状态也需自行提供）。

```css
/* 应用样式，位于库样式之后 */
:root {
  --ore-violet: #6241cf;
  --ore-violet-soft: #f0ebff;
  --ore-violet-ink: #6241cf;
  --ore-font: 'Your font', sans-serif;
}
.checkout-button {
  --ore-button-height: 44px;
  --ore-button-radius: 12px;
}
```

后续 Figma 的颜色、字体、尺寸和圆角映射到 `packages/core/src/styles.css`；状态与 variant 规则也在此处更新，React / Svelte 无需各写一份。React 使用 `className`，Svelte 使用 `class`。

## 动画策略

- 普通按钮按压：CSS `transform: scale(.97)`，160ms，`cubic-bezier(.23,1,.32,1)`，反馈轻且可中断。键盘 focus 不触发按压位移。
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
