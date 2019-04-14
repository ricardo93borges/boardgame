const fs = require('fs')

const read = () => {    
    const jsonString = fs.readFileSync(`${__dirname}/../iplist.json`, 'utf8')
    const json = JSON.parse(jsonString)
    return json
}

const write = (jsonString) => {
    fs.writeFileSync(`${__dirname}/../iplist.json`, jsonString)
}

const getIps = () => {
    const json = read()
    return json.ips
}

const storeIp = (ip) => {    
    const json = read()
    const obj = json.ips.find(obj => obj.ip === ip)
    if(obj === undefined){
        json.ips.push({ip:ip, player:''})
        const jsonString = JSON.stringify(json)
        write(jsonString)
    }
}

const storeName = (ip, name) => {
    console.log('storeName', ip, name)    
    const json = read()
    const index = json.ips.findIndex(obj => obj.ip === ip)
    console.log('index', index)
    if(index > -1){
        json.ips[index].player = name
        const jsonString = JSON.stringify(json)
        write(jsonString)
    }
}

const removeIp = (ip) => {
    const json = read()
    const index = json.ips.findIndex(obj => obj.ip === ip)
    if(index > -1){
        json.ips.splice(index, 1)
        const jsonString = JSON.stringify(json)
        write(jsonString)
    }
}

module.exports = {
    getIps,
    storeIp,
    storeName,
    removeIp
}