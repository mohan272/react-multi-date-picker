# React 18 to React 19 Migration Notes

This document records the migration work and compatibility audit for `react-multi-date-picker` version `4.5.2`.

## Scope

The package is now documented and configured as compatible with React 18 and React 19:

- Supported peer range: `react >=18 <20` and `react-dom >=18 <20`.
- The library source remains framework-agnostic React component code, built through Rollup and Babel.
- React 19 runtime verification is handled through the Vite demo projects.
- The Gatsby documentation website remains on React 17 because it is tied to Gatsby 3.1.2 and older website dependencies.

## Package Changes

### Root package

`package.json` now exposes both CommonJS and ESM builds:

- `main`: `./build/index.js`
- `module`: `./build/index.es.js`
- `types`: `index.d.ts`

The `files` whitelist now limits publish output to:

- `build`
- `plugins`
- `components`
- `index.d.ts`

The test command was tightened from `jest ./test` to `jest --roots test`, which keeps Jest focused on the test folder.

`@testing-library/react` was upgraded to `^16.3.2`, which supports React 18 and React 19 peer ranges.

### Peer dependencies

Before:

```json
{
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
```

After:

```json
{
  "react": ">=18 <20",
  "react-dom": ">=18 <20"
}
```

This means consumers must use React 18 or React 19. React 16 and 17 are no longer supported by this package version.

## Build Changes

`rollup.config.js` now creates an ESM build next to the existing CommonJS build:

- `build/index.js`: CommonJS package entry.
- `build/index.es.js`: ES module package entry.
- `build/browser.min.js`: UMD browser bundle.
- `plugins/*.js`: CommonJS plugin entry files.
- `components/*.js`: CommonJS component entry files.
- `build/*.browser.js`: browser-ready plugin and element bundles.

React, ReactDOM, `react-date-object`, and `react-element-popper` remain external dependencies in Rollup, so the package does not bundle its own React copy. This is important for React 19 because duplicate React instances can cause invalid hook calls.

## Source Compatibility Audit

The source under `src/` is already aligned with React 18 and React 19 expectations:

- Components are functional components using hooks.
- Public refs are exposed through `forwardRef`, which remains compatible with React 18 and React 19.
- No source files use `ReactDOM.render`.
- No source files use `ReactDOM.findDOMNode`.
- No source files use legacy class lifecycle methods such as `componentWillMount`, `componentWillReceiveProps`, or `componentWillUpdate`.
- No source files rely on function component `defaultProps`.

The only code-level React compatibility adjustment found in the current migration diff is in `src/components/date_picker/date_picker.js`.

### DatePicker effect dependency cleanup

The document click and scroll listener effect now depends on the values it actually reads:

```js
useEffect(() => {
  // listener setup and cleanup
}, [closeCalendar, isVisible, hideOnScroll]);
```

`outerRef` was removed from this dependency list because the effect does not read it. This avoids unnecessary listener teardown and setup work if ref identity changes while preserving the same behavior.

## Demo And Playground Status

### `demo/`

The demo is a Vite app using React 19:

- `react`: `^19.2.6`
- `react-dom`: `^19.2.6`
- `@vitejs/plugin-react`: `^6.0.1`
- `vite`: `^8.0.11`

The demo README recommends testing the package as a tarball instead of using `file:..`. This is the safest React 19 verification path because it mimics a published install and avoids accidentally loading two React copies.

Recommended flow:

```bash
npm run build
npm pack
cd demo
npm install ..\react-multi-date-picker-4.5.2.tgz
npm run dev
```

### `experiment/`

The experiment app also verifies React 19 behavior:

- `react`: `^19.1.0`
- `react-dom`: `^19.1.0`
- Vite entry uses `react-dom/client` and `createRoot`.

### `playground/`

The playground intentionally remains on React 18:

- `react`: `^18.2.0`
- `react-dom`: `^18.2.0`
- `react-multi-date-picker`: `file:..`

This is useful as a compatibility check for the lower end of the supported peer range.

### `website/`

The website remains on:

- `gatsby`: `3.1.2`
- `react`: `^17.0.2`
- `react-dom`: `^17.0.2`
- `react-multi-date-picker`: `2.10.1`

This folder was not migrated to React 19. Migrating it would require a separate Gatsby upgrade plan because Gatsby 3 is not a React 19 target.

## Consumer Migration Guide

Consumers upgrading to this package version should:

1. Use React and ReactDOM 18 or 19.
2. Render apps with `createRoot` from `react-dom/client`.
3. Make sure the app has only one installed React copy.
4. Reinstall dependencies after upgrading peer versions.
5. Prefer the package entry selected by the bundler:
   - ESM-aware bundlers should use `module`.
   - CommonJS environments should use `main`.

Example React 19 app entry:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Verification Checklist

Run these checks before publishing a React 19-compatible release:

```bash
npm run build
npm test
```

Then verify React 19 behavior through the tarball demo:

```bash
npm pack
cd demo
npm install ..\react-multi-date-picker-4.5.2.tgz
npm run build
npm run dev
```

Inside `demo`, confirm dependency resolution:

```bash
npm ls react react-dom react-multi-date-picker
```

Expected result:

- `react` resolves to the demo React 19 version.
- `react-dom` resolves to the demo React 19 version.
- `react-multi-date-picker` resolves to the packed tarball.
- There is no second React copy loaded from the repository root.

## Known Follow-Up Work

- Decide whether the root dev dependencies should stay on React 18 for lower-bound testing or move to React 19 for latest-version testing.
- If the documentation website must also support React 19, plan it as a separate Gatsby migration.
- Consider adding CI matrix jobs for React 18 and React 19 so both supported peer versions are tested automatically.
