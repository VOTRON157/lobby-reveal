const { exec } = require('child_process')
const axios = require('axios')
const https = require('https')

function getLoLPid() {
    return new Promise((resolve, reject) => {
        exec('tasklist', (err, stdout, sterr) => {
            if(err) reject(false)
            if (!stdout.includes('LeagueClientUx.exe')) return resolve(false);
            const pid = [...new Set(stdout.split('LeagueClientUx.exe')[1].split(" "))][1] // q viaje do caramba kkkkk
            resolve(pid)
        })
    })
}

function revealLobby() {
    return new Promise(async (resolve, reject) => {
        const pid = await getLoLPid()
        if(!pid) resolve(false)
        exec(`WMIC PROCESS WHERE ProcessId=${pid} GET commandline`, async (err, stdout, sterr) => {
            if (err) reject(err)
            const riot_auth = stdout.split('--riotclient-auth-token=')[1].split(' ')[0].replace('"', '')
            const riot_port = stdout.split('--riotclient-app-port=')[1].split(' ')[0].replace('"', '')
            const region = stdout.split('--region=')[1].split(' ')[0].replace('"', '')

            const httpsAgent = new https.Agent({
                rejectUnauthorized: false
            })

            const riot_agent = axios.create({
                baseURL: `https://127.0.0.1:${riot_port}`,
                httpsAgent,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'LeagueOfLegendsClient',
                    'Accept': 'application/json',
                    'Authorization': `Basic ${new Buffer.alloc(Buffer.byteLength(`riot:${riot_auth}`, "utf-8"), `riot:${riot_auth}`).toString("base64")}`,
                }
            })

            const { data } = await riot_agent({
                method: 'GET',
                url: '/chat/v5/participants/champ-select',
            })

            if (!data.participants.length) return resolve(false);

            const summoners = encodeURI(data.participants.map(summoner => summoner.name).join(','))
            resolve(`https://www.op.gg/multisearch/${region}?summoners=${summoners}`)
        })
    })

} 

module.exports = {
    getLoLPid,
    revealLobby
}