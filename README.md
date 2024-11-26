# CL

A cli tool for keeping your commit messages consistent. Based on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

![demo](./demo.gif)

## Prerequisites

- Node w/ npm

## Installation

```bash
git clone git@github.com:kaareloun/cl.git
cd cl
npm link
```

## Usage

```bash
cl [--verbose]
```

## Options

- `--verbose`: Prints the git commit output to the console.

## Customizing

You can easily customize this to your liking by editing index.ts and running `npm run build`.
