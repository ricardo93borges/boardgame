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
    if(!json.ips.includes(ip)){
        json.ips.push(ip)
        const jsonString = JSON.stringify(json)
        write(jsonString)
    }
}

const removeIp = (ip) => {
    const json = read()
    const index = json.ips.indexOf(ip)
    if(index > -1){
        json.ips.splice(index, 1)
        const jsonString = JSON.stringify(json)
        write(jsonString)
    }
}

module.exports = {
    getIps,
    storeIp,
    removeIp
}