# Commit Helper

A cli tool for keeping your commit messages consistent. Based on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

![demo](./demo.gif)

## Prerequisites

- Node

## Installation

```bash
npm i -g commit-helper
echo 'alias ch="commit-helper"' >> ~/.bashrc

# Optionally, you can skip some of the prompts
echo 'alias ch="commit-helper --no-breaking --no-task --no-wip"' >> ~/.bashrc
```

## Usage

```bash
ch [--verbose] [--no-breaking] [--no-task] [--no-wip]
```

## Options

- `--verbose`: Prints the git commit output to the console.
- `--no-breaking`: Skips the breaking change prompt.
- `--no-task`: Skips the task number prompt.
- `--no-wip`: Skips the WIP prompt.

## Customizing

```bash
git clone https://github.com/kaarel/commit-helper.git
cd commit-helper
npm link
npm run dev
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
