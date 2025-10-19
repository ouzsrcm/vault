#!/usr/bin/env node

import inquirer from 'inquirer'
import { executeCommand } from '../core/executor'
import { Command } from '../core/types'
import { getUserDocumentsPath } from '../core/utils'
import { DatabaseServices } from '../core/Services'

async function main() {
    const args = process.argv.slice(2)
    const command = args[0]
    if (!command) {
        console.error(`No command provided: ${command}`)
        process.exit(1)
    }
    switch (command) {
        case 'show-history':
            for (const cmd of DatabaseServices.CommandService.GetHistory() as Command[]) {
                console.log(`#${cmd.id}: ${cmd.command} Created At: ${cmd.created_at.toLocaleDateString()}`)
            }
            break
        case 'pick':
            const history = DatabaseServices.CommandService.GetHistory() as Command[]
            const choices = history.map(cmd => ({
                name: `#${cmd.id}: ${cmd.command} (Created At: ${cmd.created_at.toLocaleDateString()})`,
                value: cmd.id
            }))
            const { selectedCommandId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedCommandId',
                    message: 'Select a command to run:',
                    choices
                }
            ])
            const selectedCommand = history.find(cmd => cmd.id === selectedCommandId)
            if (selectedCommand) {
                console.log(`Executing command: ${selectedCommand.command}`)
                console.log(await executeCommand(selectedCommand.command))
            }
            break
        case 'run-last':
            const lastCmd = DatabaseServices.CommandService.GetLastCommand()
            if (lastCmd) {
                console.log(`#${lastCmd.id}: ${lastCmd.command} Created At: ${lastCmd.created_at.toLocaleDateString()}`)
                var output = await executeCommand(lastCmd.command)
                console.log(`Output:\n${output}`)
            } else {
                console.log('No last command found.')
            }
            break
        case 'search-term':
            const searchTerm = args[1] || ''
            const histories = DatabaseServices.CommandService.GetHistory(100)
            const filtered = histories.filter(cmd => cmd.command.includes(searchTerm) || cmd.response.includes(searchTerm))
            for (const cmd of filtered) {
                console.log(`#${cmd.id}: ${cmd.command} Created At: ${cmd.created_at.toLocaleDateString()}`)
            }
            break
        case 'rerun':
            const id = parseInt(args[1] ?? '0', 10)
            if (isNaN(id) || id <= 0) {
                console.error('Please provide a valid command ID to rerun.')
            }
            const cmd = await DatabaseServices.CommandService.ReRun(id)
            break
        case 'clear-history':
            const deletedCount = DatabaseServices.CommandService.ClearHistory()
            console.log(`Cleared ${deletedCount} commands from history.`)
            break
        case 'export-as':
            const format = args[1] || 'json'
            const exportData = DatabaseServices.CommandService.ExportHistory(format)
            var file = `${getUserDocumentsPath()}/command_history.${format}`
            require('fs').writeFileSync(file, exportData)
            console.log(`Command history exported to ${file}`)
            break
        case 'help':
            console.log(`
    Available commands:
    -------
    History Management:
    show-history           - Show command history
    search-term <term>     - Search command history
    rerun <id>             - Rerun a command by ID
    export-as [format]     - Export command history
    pick                   - Pick a command from history to run
    run-last               - Run the last executed command
    clear-history          - Clear command history

    Category Management:
    categories               - List all categories
    create-category <name>   - Create a new category
    set-default-category <id> - Set a category as default by ID

    Other:
    help                   - Show this help message
    version                - Show CLI version
    -------
    `)
            break
        case 'version':
            var ver = process.env.npm_package_version || '1.0.0'
            console.log(`CLI Version: ${ver}`)
            break
        case 'categories':
            for (const cat of DatabaseServices.CategoryService.GetAllCategories()) {
                console.log(`#${cat.id}: ${cat.name} ${cat.id === DatabaseServices.CategoryService.getDefaultCategoryId() ? '(Default)' : ''}`)
            }
            break
        case 'create-category':
            const newCategoryName = args[1] || ''
            if (!newCategoryName) {
                console.error('Please provide a category name.')
            }
            const newCategory = DatabaseServices.CategoryService.CreateCategory(newCategoryName)
            console.log(`Created new category: #${newCategory.id} - ${newCategory.name}`)
            break
        case 'set-default-category':
            const categoryId = parseInt(args[1] || '0', 10)
            if (isNaN(categoryId) || categoryId <= 0) {
                console.error('Please provide a valid category ID.')
            }
            const choiceCategories = DatabaseServices.CategoryService.GetAllCategories().map(cat => ({
                name: `#${cat.id}: ${cat.name}`,
                value: cat.id
            }))
            const { selectedCategoryId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedCategoryId',
                    message: 'Enter the ID of the category you want to set as default:',
                    choices: choiceCategories
                }
            ]);
            const success = DatabaseServices.CategoryService.setDefaultCategory(selectedCategoryId)
            if (success) {
                console.log(`Category #${selectedCategoryId} set as default.`)
            } else {
                console.error('Failed to set default category. Please ensure the category ID exists.')
            }
            break
        default:
            var res = await executeCommand(args.join(' '))
            DatabaseServices.CommandService.Remember(command, JSON.stringify(res));
            console.log(res)
            break
    }
}

main()