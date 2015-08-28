var fs = require('fs')
var os = require('os')

module.exports = {
  isEC2: function () {
    return fs.existsSync('/proc/xen') && fs.existsSync('/etc/ec2_version')
  },

  isProd: function () {
    return os.platform() === 'linux'
  }
}
