function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
function hold(timeHold) {
  let start = Date.now()
  let now = Date.now()
  while(true) {
    if (now - start >= timeHold) break
    now = Date.now()
  }
}
module.exports.sleep = sleep
module.exports.hold = hold
