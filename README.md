# Conventional Commit Message Maker

![conventional commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?style=for-the-badge&logo=conventionalcommits&labelColor=000)
![version](https://img.shields.io/npm/v/conventional-commit-message-maker?style=for-the-badge&labelColor=000)
![downloads](https://img.shields.io/npm/dt/conventional-commit-message-maker?style=for-the-badge&labelColor=black)

**A minimalist cli tool for keeping your commit messages consistent. Based on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.**

The Conventional Commits spec is a lightweight convention that defines a simple, structured format for commit messages.
It makes your commit history easier to read and automate. With properly formatted commits, tools can do stuff like generate human-friendly changelogs, automate versioning / releases and trigger specific CI/CD flows based on commit type.

**Example commit messages:**

```
feat: add new parsing feature (WIP) (#777)
test(some-package): fix failing e2e tests (#1892)
fix: resolve login bug affecting user sessions (#813)
```

## 🎨 Demo

![demo](https://github.com/kaareloun/conventional-commit-message-maker/blob/main/demo.gif?raw=true)

## ⚙️ Prerequisites

- Node.js **v20+**
- Git

## 🚀 Installation

```bash
npm i -g conventional-commit-message-maker
echo 'alias ch="conventional-commit-message-maker"' >> ~/.bashrc # or ~/.zshrc
source ~/.bashrc  # or ~/.zshrc

# Optional: you can skip some of the prompts and make multiple aliases for different projects
echo 'alias chs="conventional-commit-message-maker --no-scope --no-breaking --no-task --no-wip"' >> ~/.bashrc # or ~/.zshrc
```

## 💡 Usage

Just run this instead of `git commit`

```bash
ch
```

## 🛠 Options

| Flag            | Description                            |
| --------------- | -------------------------------------- |
| `--verbose`     | Print the raw `git commit` output      |
| `--no-scope`    | Skip the scope prompt                  |
| `--no-breaking` | Skip the breaking change prompt        |
| `--no-task`     | Skip the task number prompt            |
| `--no-wip`      | Skip the WIP (Work in Progress) prompt |

## 🧪 Customizing

```bash
npm remove -g conventional-commit-message-maker
git clone https://github.com/kaareloun/conventional-commit-message-maker.git
cd conventional-commit-message-maker
npm i
npm link
npm run dev
```

## 📓 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full version history.

## 🔗 Similar Projects

- [commitizen/cz-cli](https://github.com/commitizen/cz-cli)  
  Interactive CLI tool to help format commit messages according to the Conventional Commits spec.

- [conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint)  
  Lints commit messages and enforces Conventional Commits conventions.

- [semantic-release/semantic-release](https://github.com/semantic-release/semantic-release)  
  Fully automated version management and package publishing based on commit messages.

- [leonardoanalista/cz-customizable](https://github.com/leonardoanalista/cz-customizable)  
  A highly customizable Commitizen adapter for conventional commit prompts.

- [streamich/git-cz](https://github.com/streamich/git-cz)  
  A lightweight, interactive CLI for Conventional Commit messages.

- [googleapis/release-please](https://github.com/googleapis/release-please)  
  Automates changelog generation and releases from conventional commits.
