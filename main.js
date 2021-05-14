const url = require('url')
const https = require('https')
const dgram = require('dgram')

const {CONTENT_TYPE, BASIC_USERNAME, BASIC_PASSWORD} = process.env
const portMapping = {}

console.log(CONTENT_TYPE, BASIC_USERNAME, BASIC_PASSWORD);

// grab port mapping from env vars
Object.keys(process.env).forEach((name) => {
    if (name.startsWith('PORT_MAP_')) {
        portMapping[name.substr(9)] = process.env[name]
    }
})

if (Object.keys(portMapping).length === 0) {
    console.log('No port mappings found, shutting down')
}

// loop over port mapping and bind to the port
Object.keys(portMapping).forEach((port) => {

    // create the udp server
    const server = dgram.createSocket('udp4')

    // listen for incoming messages
    server.on('message', (msg, rinfo) => {

        console.log('%s INBOUND (%s:%s) %s', port, rinfo.address, rinfo.port, msg.toString('hex'))

        // build https client request
        const clientUrl = url.parse(portMapping[port])
        const clientOptions = Object.assign({}, clientUrl, {
            method: 'POST',
            headers: {
                'Content-Type': CONTENT_TYPE || 'application/octet-stream'
            }
        })

        // add basic auth if applicable
        if (BASIC_USERNAME) {
            clientOptions.headers.Authorization = 'Basic ' + new Buffer(BASIC_USERNAME + ':' + BASIC_PASSWORD).toString('base64')
        }

        const payload = {
            "data": msg
        }

        // handle target response
        const clientReq = https.request(clientOptions, (clientRes) => {
            console.log('%s RESP (%s:%s) %s', port, rinfo.address, rinfo.port, clientRes.statusCode)
            if (clientRes.statusCode === 200) {
                let data = ''
                clientRes
                    .on('data', (chunk) => {
                        data += chunk
                    })
                    .on('end', () => {
                        const buffer = Buffer.from(data, 'hex')
                        console.log('%s OUTBOUND (%s:%s) %s', port, rinfo.address, rinfo.port, buffer.toString('hex'))
                        server.send(buffer, rinfo.port, rinfo.address, (err) => {
                            if (err) {
                                console.log('%s ERROR %s', port, err.message)
                            }
                        })
                    })
            }
        })

        // write the message to the client
        clientReq.write(JSON.stringify(payload))
        clientReq.end()
    })

    // listen for server ready
    server.on('listening', () => {
        console.log('FORWARDING port %s to %s', port, portMapping[port])
    })

    // bind udp server to port
    server.bind(port)

})
