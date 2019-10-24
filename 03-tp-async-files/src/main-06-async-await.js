const fs = require('fs').promises

const pathToFolderToBkp = './src'
const copyIdentifier = '(copy-as-aw)'
let n = 1

async function main() {
    try {
        const names = await fs.readdir(pathToFolderToBkp)
        const targets = filterNames(names)
        avoidProcessingEmptyList(targets)
        createFolderIfNeeded()
        backupTargets(targets)
    } catch (err) {
        showError(err)
    }
}

main()

function filterNames(names) {
    const targets = []
    for (const name of names) {
        if (name.includes('.') && !name.startsWith('.')) {
            targets.push(name)
        }
    }
    return targets
}

function avoidProcessingEmptyList(targets) {
    if (!targets.length) {
        throw new Error('no files to backup')
    }
    return targets
}

async function createFolderIfNeeded() {
    try {
        await fs.mkdir(pathToFolderToBkp + copyIdentifier)
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw new Error('error creating folder')
        }
    }
}

function backupTargets(targets) {
    for (const target of targets) {
        backupTarget(target)
    }
}

async function backupTarget(target) {
    try {
        const data = await fs.readFile(pathToFolderToBkp + '/' + target, 'utf8')
        await fs.writeFile(pathToFolderToBkp + copyIdentifier + '/' + target, data)
        console.log(`done one copy (${target})`)
    } catch (err) {
        console.log('error processing one copy' + err)
    }
}

function showError(err) {
    console.log(err)
}