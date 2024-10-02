const readline = require('readline')
const fs = require('fs').promises
const path = require('path')

const DEFAULT_PATH = 'organized'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(question) {
  return new Promise(resolve => rl.question(question, resolve))
}

async function organizeFiles(workingFolder) {
  try {
    const files = await fs.readdir(workingFolder)

    files.forEach(file => {
      const nestedDirectoryName = file.split('.').pop()
      organizeFolders(workingFolder, nestedDirectoryName, file)
    })
  } catch (error) {
    console.error('No files in this directory')
  }
}

// async function organizeFiles(workingFolder) {
//   try {
//     const files = await fs.readdir(workingFolder)
//     // console.log('files ---------', files)

//     for (const file of files) {
//       // Используем for...of вместо forEach
//       const nestedDirectoryName = file.split('.').pop()
//       // const fullNestedPath = path.join(workingFolder, nes)
//       await organizeFolders(workingFolder, nestedDirectoryName, file) // Ждем завершения
//     }
//   } catch (error) {
//     console.error('No files in this directory', error)
//   }
// }

async function organizeFolders(workingFolder, nestedDirectoryName, file) {
  const filePath = await path.join(workingFolder, file)
  const newDirectoryPath = await path.join(workingFolder, nestedDirectoryName)

  try {
    console.log(']]]]]]]]]]]]]]', filePath, '------------------', newDirectoryPath)
    await fs.access(newDirectoryPath)

    await moveFile(filePath, path.join(newDirectoryPath, file))
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(newDirectoryPath)
    }

    console.error("Can't get access to this folder")
  }
}

async function moveFile(filePath, moveToPath) {
  try {
    await fs.copyFile(filePath, moveToPath)
    await fs.unlink(filePath)
  } catch (error) {
    console.error("Can't move the file to this path", error)
  }
}

async function runOrganizer() {
  console.log('> Welcome to file organizer!\n> To answer the question, use **y** for Yes and **n** for No. \n \n')

  let needToOrganizePath = await askQuestion('> Do you want organize the files in organized folder? : ')

  if (needToOrganizePath.trim() && needToOrganizePath.trim() === 'y') {
    needToOrganizePath = DEFAULT_PATH
    console.log('corect', needToOrganizePath)
  } else {
    console.log('incorect', needToOrganizePath)
  }

  const workingFolder = await path.join(process.cwd(), needToOrganizePath)
  console.log(workingFolder)

  await organizeFiles(workingFolder)
}

runOrganizer()
