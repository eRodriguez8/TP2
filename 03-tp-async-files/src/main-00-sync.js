const fs = require('fs')

const pathToFolderToBkp = './src'
const copyIdentifier = '(copy-sync)'

try {
    const names = fs.readdirSync(pathToFolderToBkp)
    const targets = []
    for (const name of names) {
        if (name.includes('.') && !name.startsWith('.')) {
            targets.push(name)
        }
    }
    if (targets.length) {
        try {
            fs.mkdirSync(pathToFolderToBkp + copyIdentifier)
        } catch (err){
            if (err.code !== 'EEXIST'){
                throw new Error('error creating folder')
            }
        }
        for (const target of targets) {
            try {
                const data = fs.readFileSync(pathToFolderToBkp + '/' + target, 'utf8')
                fs.writeFileSync(pathToFolderToBkp + copyIdentifier + '/' + target, data)
                console.log(`done one copy (${target})`)
            } catch (error) {
                console.log('error doing backup for: ' + target)
            }
        }
    }
} catch (err) {
    console.log(err)
}
