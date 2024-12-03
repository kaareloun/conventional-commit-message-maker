#!/usr/bin/env node

import {
  intro,
  confirm,
  select,
  text,
  outro,
  cancel,
  group,
} from '@clack/prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import fs from 'fs/promises'

const [, , ...args] = process.argv
const verbose = args.includes('--verbose')
const noScope = args.includes('--no-scope')
const noBreaking = args.includes('--no-breaking')
const noTask = args.includes('--no-task')
const noWip = args.includes('--no-wip')

async function main() {
  const isGitRepo = await execa`git rev-parse --is-inside-work-tree`.then(
    () => true,
    () => false,
  )
  if (!isGitRepo) {
    outro('Not a git repository.')
    process.exit()
  }

  const { stdout } = await execa`git diff --cached --numstat`.pipe`wc -l`
  const files = Number(stdout)
  if (files <= 0) {
    outro('No staged files.')
    process.exit()
  }

  intro(`Committing ${files} staged file${files > 1 ? 's' : ''}`)

  await group(
    {
      commitType: handleCommitTypePrompt,
      scope: handleScopePrompt,
      breakingChange: handleBreakingChangePrompt,
      message: handleMessagePrompt,
      taskNumber: handleTaskNumberPrompt,
      isWIP: handleWipPrompt,
      commit: handleCommit,
    },
    {
      onCancel: () => {
        cancel('Cancelled.')
        process.exit(0)
      },
    },
  )

  const { stdout: gitStatus } = await execa`git status`
  console.log(gitStatus)
}

function handleCommitTypePrompt() {
  return select({
    message: 'Select the type of change you are commiting',
    options: [
      { value: 'feat', label: 'feat: New feature implementation' },
      { value: 'fix', label: 'fix: Bug fixes' },
      {
        value: 'chore',
        label: 'chore: Maintenance tasks, housekeeping, etc.',
      },
      { value: 'test', label: 'test: Adding or modifying tests' },
      { value: 'build', label: 'build: Build related changes' },
      {
        value: 'ci',
        label: 'ci: Changes to CI configuration or scripts',
      },
      { value: 'docs', label: 'docs: Documentation changes' },
      { value: 'perf', label: 'perf: Performance improvements' },
      { value: 'refactor', label: 'refactor: Code refactoring' },
      { value: 'revert', label: 'revert: Reverting changes' },
      {
        value: 'style',
        label: 'style: Code style changes (e.g formatting)',
      },
    ],
    initialValue: 'feat',
  })
}

function handleScopePrompt() {
  if (noScope) {
    return undefined
  }

  return text({
    message: `Scope of the change, (press ${chalk.cyan('[enter]')} to skip)`,
  })
}

function handleBreakingChangePrompt() {
  if (noBreaking) {
    return undefined
  }

  return text({
    message: `Does this change introduce a breaking change? (press ${chalk.cyan('[enter]')} to skip)`,
  })
}

function handleMessagePrompt() {
  return text({
    message:
      'Write a short & imperative summary of the code changes (lower case and no period)',
    validate: (v) => {
      if (v.length === 0) return 'Commit message is required'
    },
  })
}

function handleTaskNumberPrompt() {
  if (noTask) {
    return undefined
  }

  return text({
    message: `Provide task number, (press ${chalk.cyan('[enter]')} to skip)`,
  })
}

function handleWipPrompt() {
  if (noWip) {
    return undefined
  }

  return confirm({
    message: 'Is this task a WIP?',
    initialValue: false,
  })
}

async function handleCommit({
  results: { commitType, scope, breakingChange, message, isWIP, taskNumber },
}: any) {
  const commitTypeWithScope = scope
    ? `${commitType}(${scope.toLowerCase().trim()})`
    : commitType
  const commitTypeWithScopeAndBreaking = breakingChange
    ? `${commitTypeWithScope}!`
    : commitTypeWithScope

  const fullMessage = `${commitTypeWithScopeAndBreaking}: ${message!.toLowerCase().trim()}${isWIP ? ' (WIP)' : ''}${taskNumber ? ` (${taskNumber.toString()})` : ''}`

  const usesHusky = await fs
    .stat('.husky')
    .then(() => true)
    .catch(() => false)

  await execa({
    stdout: verbose || usesHusky ? process.stdout : 'ignore',
    stderr: verbose || usesHusky ? process.stdout : 'ignore',
  })`git commit -m ${fullMessage}`

  outro(`Committed ${fullMessage}`)
}

main().catch((e) => {
  console.error(e)
  outro(
    `${chalk.red('CATASTROPHIC FAILURE')}: Something went wrong committing your spaghetti`,
  )
})
