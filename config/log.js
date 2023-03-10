'use strict';

module.exports = {
  log: {
    level: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO',
    dir: 'logs',
    sizeLimit: 1024 * 1024 * 5,
    requestLog: true,
    file: true,
  },
};
