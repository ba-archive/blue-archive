# Blue Archive Monorepo

[简体中文](README.md) | English

This project organizes a monorepo using `rush.js` to standardize code conventions and dependencies across various projects. It optimizes the inclusion of common packages in project setups.

## Environment Information

- Current Rush Version: `5.112.1`
- Recommended Node Version: `20` (Tested and working with version: `v20.7.0`)
- Project Package Manager Version Information: `pnpm@latest` (Tested and working with version: `8.10.5`)

## Configuration Guide

**Install Node 20 (Recommended to use [nvm](https://github.com/nvm-sh/nvm))**

> For Windows systems, it is recommended to install [scoop](https://scoop.sh/) first, then use scoop to install nvm, and finally use nvm to install Node.

```powershell
# Windows
# Install scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser # Optional: Needed to run a remote script the first time
irm get.scoop.sh | iex

# Install nvm
scoop install nvm

# Install Node
nvm install 20
nvm use 20
```

**Install Rush**

```bash
# Install pnpm
npm install -g pnpm
pnpm install -g @microsoft/rush
rush update # Execute this in the blue-archive root directory, same for the following commands
# Build and link projects
rush build
```

# Project Structure

- `apps/` Application directory
- `lib/` Library directory
- `lib/ba-rig` Rush rig package for this repository, see details: [Rush Rig Packages](https://heft.rushstack.io/en/pages/intro/rig_packages/)
- `lib/ba-story-player` Story player component library

## Proper usage of eslint and lint-staged

**eslint and lint-staged configuration files**

- `.eslintrc`
- `.eslintignore`
- `.lintstagedrc.mjs`
- `common/autoinstallers/rush-eslint/.eslintrc`
- `common/autoinstallers/rush-eslint/.lintstagedrc_base.mjs`

**Global tsconfig**

- `lib/ba-rig/profiles/default/tsconfig-base.json`

## Proper usage of the .vscode folder

The `.vscode` folder can store recommended extensions for the project. `settings.json` can also be used to unify some vscode settings, such as the dictionary for the typo plugin.
