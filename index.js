const WebsocketServer = require('websocket').server;
const httpServer = require('http').createServer();
const mdns = require('mdns');

const DEVICE_DISCOVERY_START_MESSAGE = 'device_discovery/start';
const DEVICE_DISCOVERY_UP_MESSAGE = 'device_discovery/up';
const DEVICE_DISCOVERY_DOWN_MESSAGE = 'device_discovery/down';

const socketServer = new WebsocketServer({
  httpServer: httpServer,
  autoAcceptConnections: true
});

const isLocalNameDiscriminator = 'field';
const isLocalAddressDiscriminator = '192.168';
const isLocalService = service => service && service.name.includes(isLocalNameDiscriminator) && service.addresses.find(address => address.includes(isLocalAddressDiscriminator))

const discoverServices = (connection) => {

  const browser = mdns.createBrowser(mdns.tcp('http'));

  browser.on('serviceUp', service => {
    if (isLocalService(service)) {
      const localAddress = service.addresses.find(address => address.includes(isLocalAddressDiscriminator));
      connection.sendUTF(JSON.stringify({ 
        name: DEVICE_DISCOVERY_UP_MESSAGE,
        service: { ...service, localAddress }
      }))
    }
  });

  browser.on('serviceDown', service => {
    if (isLocalService(service)) {
      const localAddress = service.addresses.find(address => address.includes(isLocalAddressDiscriminator));
      connection.sendUTF(JSON.stringify({ 
        name: DEVICE_DISCOVERY_DOWN_MESSAGE,
        service: { ...service, localAddress }
      }))
    }
  });

  browser.start();
}

socketServer.on('connect', connection => {
    connection.on('message', data => {
      if (data.type === 'utf8') {
        switch (data.utf8Data) {
          case DEVICE_DISCOVERY_START_MESSAGE: discoverServices(connection); break;
        }
      } 
    })
})


httpServer.listen(8082, () => {
  console.log('mdns server listening on *:8082');
})