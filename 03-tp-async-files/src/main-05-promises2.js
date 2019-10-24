const fs = require('fs').promises

const pathToFolderToBkp = './src'
const copyIdentifier = '(copy-prom2)'

fs.readdir(pathToFolderToBkp)
    .then(filterNames)
    .then(avoidProcessingEmptyList)
    .then(createFolderIfNeeded)
    .then(backupTargets)
    .catch(showError)

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

function createFolderIfNeeded(targets) {
    return fs.mkdir(pathToFolderToBkp + copyIdentifier)
        .then(() => {
            return targets
        })
        .catch(err => {
            if (err.code === 'EEXIST') {
                return targets
            } else {
                throw new Error('error creating folder')
            }
        })
}

function backupTargets(targets) {
    for (const target of targets) {
        backupTarget(target)
    }
}

function backupTarget(target){
    fs.readFile(pathToFolderToBkp + '/' + target, 'utf8')
        .then(data => {
            return fs.writeFile(pathToFolderToBkp + copyIdentifier + '/' + target, data)
        })
        .then(() => {
            console.log(`done one copy (${target})`)
        })
        .catch(err => {
            console.log('error processing one copy' + err)
        })
}

function showError(err) {
    console.log(err)
}