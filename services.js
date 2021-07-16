const mdns = require('mdns');

mdns.createAdvertisement(mdns.tcp('http'), 4567, { name: 'field_1'} ).start();
mdns.createAdvertisement(mdns.tcp('http'), 9000, { name: 'field_2'} ).start();
mdns.createAdvertisement(mdns.tcp('http'), 4569, { name: 'field_3'} ).start();
mdns.createAdvertisement(mdns.tcp('http'), 4570, { name: 'field_4'} ).start();
mdns.createAdvertisement(mdns.tcp('http'), 4571, { name: 'field_5'} ).start();