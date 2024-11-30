#!/usr/bin/env node

import { intro, confirm, select, text, outro, isCancel } from '@clack/prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import fs from 'fs/promises'

async function main() {
  const usesHusky = await fs
    .stat('.husky')
    .then(() => true)
    .catch(() => false)

  const [, , ...args] = process.argv
  const verbose = args.includes('--verbose') || usesHusky
  const noBreaking = args.includes('--no-breaking')
  const noTask = args.includes('--no-task')
  const noWip = args.includes('--no-wip')

  const { stdout } = await execa`git diff --cached --numstat`.pipe`wc -l`
  const files = Number(stdout)
  if (files <= 0) {
    outro('No staged files.')
    process.exit()
  }

  intro(`Committing ${files} staged file${files > 1 ? 's' : ''}`)

  let commitType = await promptCommitType()
  const breakingChange = noBreaking ? false : await promptBreakingChange()
  const message = await promptMessage()
  const taskNumber = noTask ? undefined : await promptTaskNumber()
  const isWIP = noWip ? false : await promptIsWIP()

  if (breakingChange) {
    commitType = `${commitType}!`
  }

  const fullMessage = `${commitType.toString()}: ${message.toString()}${isWIP ? ' (WIP)' : ''}${taskNumber ? ` (${taskNumber.toString()})` : ''}`

  await execa({
    stdout: verbose ? process.stdout : 'ignore',
    stderr: verbose ? process.stdout : 'ignore',
  })`git commit -m ${fullMessage}`
  outro(`Committed "${fullMessage}"`)

  const { stdout: gitStatus } = await execa`git status`
  console.log(gitStatus)
}

async function promptCommitType() {
  return await handleStep(
    select({
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
        { value: 'ci', label: 'ci: Changes to CI configuration or scripts' },
        { value: 'docs', label: 'docs: Documentation changes' },
        { value: 'perf', label: 'perf: Performance improvements' },
        { value: 'refactor', label: 'refactor: Code refactoring' },
        { value: 'revert', label: 'revert: Reverting changes' },
        { value: 'style', label: 'style: Code style changes (e.g formatting)' },
      ],
      initialValue: 'feat',
    }),
  )
}
async function promptBreakingChange() {
  return await handleStep(
    text({
      message: `Does this change introduce a breaking change? (press ${chalk.cyan('[enter]')} to skip)`,
    }),
  )
}
async function promptMessage() {
  return await handleStep(
    text({
      message:
        'Write a short & imperative summary of the code changes (lower case and no period)',
      validate: (v) => {
        if (v.length === 0) return 'Commit message is required'
      },
    }),
  ).then((msg) => `${msg}`.toLowerCase().trim())
}
async function promptTaskNumber() {
  return await handleStep(
    text({
      message: `Provide task number, (press ${chalk.cyan('[enter]')} to skip)`,
    }),
  )
}
async function promptIsWIP() {
  return await handleStep(
    confirm({ message: 'Is this task a WIP?', initialValue: false }),
  )
}

async function handleStep(handlerPromise: Promise<string | boolean | symbol>) {
  const res = await handlerPromise
  if (isCancel(res)) {
    outro('Cancelled')
    process.exit()
  }

  return res
}

main().catch((e) => {
  console.error(e)
  outro(
    `${chalk.red('CATASTROPHIC FAILURE')}: Something went wrong committing your spaghetti`,
  )
})
