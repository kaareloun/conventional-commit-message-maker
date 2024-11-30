#!/usr/bin/env node

import { intro, confirm, select, text, outro, isCancel } from '@clack/prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import fs from 'fs/promises'

async function main() {
  const [, , ...args] = process.argv
  const usesHusky = await fs
    .stat('.husky')
    .then(() => true)
    .catch(() => false)
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

  const handleStep = async (
    handlerPromise: Promise<string | boolean | symbol>,
  ) => {
    const res = await handlerPromise
    if (isCancel(res)) {
      outro('Cancelled')
      process.exit()
    }

    return res
  }

  intro(`Committing ${files} staged file${files > 1 ? 's' : ''}`)

  let commitType = await handleStep(
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

  const breakingChange = noBreaking
    ? false
    : await handleStep(
        text({
          message: `Does this change introduce a breaking change? (press ${chalk.cyan('[enter]')} to skip)`,
        }),
      )

  if (breakingChange) {
    commitType = `${commitType}!`
  }

  const message = await handleStep(
    text({
      message:
        'Write a short & imperative summary of the code changes (lower case and no period)',
      validate: (v) => {
        if (v.length === 0) return 'Commit message is required'
      },
    }),
  ).then((msg) => `${msg}`.toLowerCase().trim())

  const taskNumber = noTask
    ? undefined
    : await handleStep(
        text({
          message: `Provide task number, (press ${chalk.cyan('[enter]')} to skip)`,
        }),
      )

  const isWIP = noWip
    ? false
    : await handleStep(
        confirm({ message: 'Is this task a WIP?', initialValue: false }),
      )

  const fullMessage = `${commitType.toString()}: ${message.toString()}${isWIP ? ' (WIP)' : ''}${taskNumber ? ` (${taskNumber.toString()})` : ''}`

  await execa({
    stdout: verbose ? process.stdout : 'ignore',
    stderr: verbose ? process.stdout : 'ignore',
  })`git commit -m ${fullMessage}`
  outro(`Committed "${fullMessage}"`)

  const { stdout: gitStatus } = await execa`git status`
  console.log(gitStatus)
}

main().catch((e) => {
  console.error(e)
  outro(
    `${chalk.red('CATASTROPHIC FAILURE')}: Something went wrong committing your spaghetti`,
  )
})
