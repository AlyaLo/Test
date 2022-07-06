const { promisify } = require('util');
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat); 
let mapFiles = new Map;
let pathDir = []
let key = 0;
async function getFiles(dir){
    
    const subfolders = await readdir(dir);

    let coutFile = 0
    pathDir.push(dir)

    const files = await Promise.all(subfolders.map(async (subfolder) => {

        // преобразует путь к файлу из относительного в абсолютный
        const res = resolve(dir, subfolder);

        return (await stat(res)).isDirectory() ? getFiles(res) : ++coutFile;
    }));
    mapFiles.set(key++, [files[files.length-1] || '0', files.filter(value => Array.isArray(value)).length])

    return files
}

getFiles("lala")
  .then(() => {
    pathDir.reverse().forEach((value,index) => {
            let message = {
                path: value,
                files: parseInt(mapFiles.get(index)[0]),
                dirs: mapFiles.get(index)[1]
            }
            fs.writeFileSync(value + '/info.json',JSON.stringify(message) )

    })
    
    console.log(mapFiles.get(0))
}) // выводим массив путей
  .catch(e => console.error(e)); // или ошибки в консоль

