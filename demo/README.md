# Demo: Test Local DatePicker with React 19 (Tarball Approach)

This demo uses React 19. To avoid runtime issues from local linking (`file:..`), install `react-multi-date-picker` from a packed tarball (`npm pack`) instead.

## Why this approach

When using `file:..`, the app can accidentally load a different React instance/version from the repository root.  
That can cause DatePicker rendering or hook issues.

Using a tarball makes `react-multi-date-picker` behave like a published package and keeps React resolution inside the demo app.

## One-time setup

From repository root:

```bash
npm run build
npm pack
```

This creates a file like:

`react-multi-date-picker-4.5.2.tgz`

From `demo`:

```bash
npm install ..\react-multi-date-picker-4.5.2.tgz
```

Then run:

```bash
npm run dev
```

## Development update cycle

After each library code change:

1. Root: `npm run build`
2. Root: `npm pack`
3. Demo: `npm install ..\react-multi-date-picker-4.5.2.tgz`
4. Demo: clear Vite cache if needed
   - PowerShell: `Remove-Item -Recurse -Force node_modules\.vite`
5. Demo: `npm run dev`

## Verify dependency resolution

Run inside `demo`:

```bash
npm ls react react-dom react-multi-date-picker
```

Expected:

- `react` and `react-dom` are the demo versions (React 19).
- `react-multi-date-picker` is installed from tarball (not `-> ..` symlink).
- No extra React 18 path is used by the running app.

## Notes

- If tarball filename changes with version, update the install command accordingly.
- If npm caches old tarball content, reinstall with `--force`.
