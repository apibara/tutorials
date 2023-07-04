import { uint256 } from "https://esm.sh/starknet@5.15.1"
import { formatUnits } from "https://esm.sh/viem@1.2.7"

export const ETH_DECIMALS = 18
export const USDC_DECIMALS = 6 

export default function transform(batch) {
  return batch.flatMap(handleBlock)
}

function handleBlock(block) {
  const { header, events } = block
  return (events ?? []).map(({ event, receipt }) => handleEvent(header, receipt, event))
}

function handleEvent(header, receipt, event) {
  const senderAddress = event.data[0]
  const amount0In = +formatUnits(
    uint256.uint256ToBN({ low: event.data[1], high: event.data[2] }),
    ETH_DECIMALS
  )
  const amount1In = +formatUnits(
    uint256.uint256ToBN({ low: event.data[3], high: event.data[4] }),
    USDC_DECIMALS
  )
  const amount0Out = +formatUnits(
    uint256.uint256ToBN({ low: event.data[5], high: event.data[6] }),
    ETH_DECIMALS
  )
  const amount1Out = +formatUnits(
    uint256.uint256ToBN({ low: event.data[7], high: event.data[8] }),
    USDC_DECIMALS
  )
  const toAddress = event.data[9]

  const token0Price = (amount1In + amount1Out) / (amount0In + amount0Out)
  const token1Price = (amount0In + amount0Out) / (amount1In + amount1Out)
  return {
    exchange: 'Jediswap',
    token0: 'ETH',
    token1: 'USDC',
    pair: '0x04d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a',
    block_number: +header.blockNumber,
    block_time: header.timestamp,
    transaction_hash: receipt.transactionHash,
    sender_address: senderAddress,
    amount0_in: amount0In,
    amount1_in: amount1In,
    amount0_out: amount0Out,
    amount1_out: amount1Out,
    to_address: toAddress,
    token0_price: token0Price,
    token1_price: token1Price,
  }
}
