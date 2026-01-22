# Electron App (scaffold)

Minimal Electron scaffold created in this workspace.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The `start` script runs `electron .`. If you prefer a local install, `npm install --save-dev electron` is in `package.json`.

## Build & Publish

This project uses `electron-builder` and `electron-updater` configured to publish to GitHub Releases.

1. Set your `build.publish` owner/repo in `package.json`.
2. Create a GitHub token with `repo` scope and set it in your environment as `GH_TOKEN` (or as a repository secret for CI).

Build locally (creates installer in `dist/`):

```powershell
npm ci
$env:GH_TOKEN = "ghp_..."  # optional for publishing
npm run dist -- --publish=never
```

Publish to GitHub Releases (from local machine):

```powershell
$env:GH_TOKEN = "ghp_..."
npm run dist -- --publish=always
```

Notes:
- Auto-updates only work from an installed application produced by `electron-builder` — `npm start` does not exercise update check
- For Windows/macOS code signing provide `CSC_LINK` and `CSC_KEY_PASSWORD` (or use secrets in CI). Without signing, Windows and macOS builds may be blocked or show warnings.
- CI workflow is added at `.github/workflows/publish.yml` (publishes on tag push) and `.github/workflows/ci.yml` (builds on push/PR without publishing).

## Testing updates

1. Build and install version `v1.0.0` on a machine.
2. Create a new release tag `v1.0.1` and publish the artifacts to GitHub Releases.
3. Start the installed app — `autoUpdater.checkForUpdatesAndNotify()` will detect the new release and download it.
4. When downloaded, use the app UI to install the update (or allow `autoUpdater.quitAndInstall()` to proceed).

Ensure `GH_TOKEN` is available to the publishing step when creating releases from CI or locally.