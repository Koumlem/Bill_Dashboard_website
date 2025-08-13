export function toTxn({
  id, src, time, amount, currency = 'CNY',
  type, merchant, item, channel, status,
  orderId, merchantOrderId, note,
  accountFrom, accountTo, raw
}) {
  return {
    id, src, time, amount, currency,
    type, merchant, item, channel, status,
    orderId, merchantOrderId, note,
    account_from: accountFrom ?? null,
    account_to: accountTo ?? null,
    raw
  }
}
