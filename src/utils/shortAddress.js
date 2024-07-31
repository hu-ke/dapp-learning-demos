export default function shortAddress(address, startLength = 6, endLength = 4) {
  if (!address) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}