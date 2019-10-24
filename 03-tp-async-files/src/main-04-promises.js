const fs = require('fs').promises

const pathToFolderToBkp = './src'
const copyIdentifier = '(copy-prom)'

fs.readdir(pathToFolderToBkp)

    .then(names => {
        const targets = []
        for (const name of names) {
            if (name.includes('.') && !name.startsWith('.')) {
                targets.push(name)
            }
        }
        return targets
    })

    .then(targets => {
        if (!targets.length) {
            throw new Error('no files to backup')
        }
        return targets
    })

    .then(targets => {
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
    })

    .then(targets => {
        for (const target of targets) {
            fs.readFile(pathToFolderToBkp + '/' + target, 'utf8')
                .then(data => {
                    return fs.writeFile(pathToFolderToBkp + copyIdentifier + '/' + target, data)
                })
                .then(() => {
                    console.log(`done one copy (${target})`)
                })
                .catch(err => {
                    console.log('error processing one promise' + err)
                })
        }
    })

    .catch(err => {
        console.log(err)
    })
