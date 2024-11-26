# Commit Helper

Commit helper is a cli tool for keeping your commit messages consistent. Based on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

![demo](./demo.gif)

## Prerequisites

- Node w/ npm

## Installation

```bash
npm i -g commit-helper
echo 'alias ch="commit-helper"' >> ~/.bashrc
```

## Usage

```bash
ch [--verbose]
```

## Options

- `--verbose`: Prints the git commit output to the console.

## Customizing

You can easily customize this to your liking by editing index.ts and running `npm run build`.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
