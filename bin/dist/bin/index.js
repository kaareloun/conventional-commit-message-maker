#!/usr/bin/env node
import { intro, confirm, select, text, outro, isCancel } from '@clack/prompts';
import chalk from 'chalk';
import { execa } from 'execa';
async function main() {
    console.log('building');
    const [, , ...args] = process.argv;
    const verbose = args.includes('--verbose');
    const { stdout } = await execa `git diff --cached --numstat`.pipe `wc -l`;
    const files = Number(stdout);
    if (files <= 0) {
        outro('No staged files.');
        process.exit();
    }
    const handleStep = async (handlerPromise) => {
        const res = await handlerPromise;
        if (isCancel(res)) {
            outro('Cancelled');
            process.exit();
        }
        return res;
    };
    intro(`Committing ${files} staged file${files > 1 ? 's' : ''}`);
    const commitType = await handleStep(select({
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
    }));
    const message = await handleStep(text({
        message: 'Write a short & imperative summary of the code changes (lower case and no period)',
        validate: (v) => {
            if (v.length === 0)
                return 'Commit message is required';
        },
    })).then((msg) => `${msg}`.toLowerCase().trim());
    const taskNumber = await handleStep(text({
        message: `Provide task number, (press ${chalk.cyan('[enter]')} to skip)`,
    }));
    const isWIP = await handleStep(confirm({ message: 'Is this task a WIP?', initialValue: false }));
    const fullMessage = `${commitType.toString()}: ${message.toString()}${isWIP ? ' (WIP)' : ''}${taskNumber ? ` (${taskNumber.toString()})` : ''}`;
    await execa({
        stdout: process.stdout,
        stderr: process.stdout,
    }) `git commit -m ${fullMessage}`;
    outro(`Committed "${fullMessage}"`);
    const { stdout: gitStatus } = await execa `git status`;
    console.log(gitStatus);
}
try {
    await main();
}
catch (e) {
    outro(`${chalk.red('CATASTROPHIC FAILURE')}: Something went wrong committing your spaghetti`);
}
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map