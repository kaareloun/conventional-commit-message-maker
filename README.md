# Conventional Commit Message Maker

A cli tool for keeping your commit messages consistent. Based on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

![demo](https://github.com/kaareloun/conventional-commit-message-maker/blob/main/demo.gif?raw=true)

## Prerequisites

- Node >= 20
- Git

## Installation

### MacOS

#### 1. Install

```bash
npm i -g conventional-commit-message-maker
echo 'alias ch="conventional-commit-message-maker"' >> ~/.zshrc
source ~/.zshrc

# You can skip some of the prompts and make multiple aliases for different projects
echo 'alias chs="conventional-commit-message-maker --no-scope --no-breaking --no-task --no-wip"' >> ~/.zshrc
```

### Linux

#### 1. Install

```bash
npm i -g conventional-commit-message-maker
echo 'alias ch="conventional-commit-message-maker"' >> ~/.bashrc
source ~/.bashrc

# You can skip some of the prompts and make multiple aliases for different projects
echo 'alias chs="conventional-commit-message-maker --no-scope --no-breaking --no-task --no-wip"' >> ~/.bashrc
```

## Usage

```bash
ch
```

## Options

- `--verbose`: Prints the git commit output to the console.
- `--no-scope`: Skips the scope prompt.
- `--no-breaking`: Skips the breaking change prompt.
- `--no-task`: Skips the task number prompt.
- `--no-wip`: Skips the WIP prompt.

## Customizing

```bash
npm remove -g conventional-commit-message-maker
git clone https://github.com/kaarel/conventional-commit-message-maker.git
cd conventional-commit-message-maker
npm i
npm link
npm run dev
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
