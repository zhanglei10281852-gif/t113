// Manual mock for vant (avoids ESM parsing issues in Jest)
// vant barrel does: export { default as Toast } from './toast'
// So sub-module imports need .default to be the actual function
const Toast = Object.assign(jest.fn(), { fail: jest.fn() })
const Dialog = Object.assign(jest.fn(), { confirm: jest.fn() })

// Named exports for direct import { Toast } from 'vant'
module.exports = Toast
module.exports.Toast = Toast
module.exports.Dialog = Dialog
module.exports.default = Toast
