const fs = require('fs')

const pathToFolderToBkp = './src'
const copyIdentifier = '(copy-sync2)'

try {
    const names = fs.readdirSync(pathToFolderToBkp)
    const targets = filterNames(names)
    avoidProcessingEmptyList(targets)
    createFolderIfNeeded(pathToFolderToBkp + copyIdentifier)
    backupTargets(targets)
} catch (err) {
    console.log(err)
}

function filterNames(names){
    const targets = []
    for (const name of names) {
        if (name.includes('.') && !name.startsWith('.')) {
            targets.push(name)
        }
    }
    return targets
}

function avoidProcessingEmptyList(targets){
    if (!targets.length){
        throw new Error('no files to backup')
    }
}

function createFolderIfNeeded(path){
    try {
        fs.mkdirSync(path)
    } catch (err){
        if (err.code !== 'EEXIST'){
            throw new Error('error creating folder')
        }
    }
}

function backupTargets(targets){
    for (const target of targets) {
        try {
            const data = fs.readFileSync(pathToFolderToBkp + '/' + target, 'utf8')
            fs.writeFileSync(pathToFolderToBkp + copyIdentifier + '/' + target, data)
            console.log(`done one copy (${target})`)
        } catch (err){
            console.log('error doing backup for: ' + target)
        }
    }
}
