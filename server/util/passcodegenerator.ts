export function generatePasscode(length?) {
  var length =length?length:6,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    passcode = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    passcode += charset.charAt(Math.floor(Math.random() * n));
  }
  return passcode;
}


export function uuidv4() {
  return 'xxxxxxxx-xxxx3xx-yxx4xxx-yxxx2xx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
