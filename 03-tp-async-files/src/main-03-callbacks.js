const fs = require('fs')

const pathToFolderToBkp = './src'
const copyIdentifier = '(copy-CBs)'

fs.readdir(pathToFolderToBkp, (err, names) => {
    if (err) {
        console.log(err)
    } else {
        const targets = []
        for (const name of names) {
            if (name.includes('.') && !name.startsWith('.')) {
                targets.push(name)
            }
        }
        if (targets.length) {
            fs.mkdir(pathToFolderToBkp + copyIdentifier, (err) => {
                if (err && err.code !== 'EEXIST') {
                    console.log(err)
                } else {
                    for (const target of targets) {
                        fs.readFile(pathToFolderToBkp + '/' + target, 'utf8', (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                fs.writeFile(pathToFolderToBkp + copyIdentifier + '/' + target, data, (err) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log(`done one copy (${target})`)
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }
})