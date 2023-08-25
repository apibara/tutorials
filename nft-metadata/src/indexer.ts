import { hash, uint256 } from "https://esm.sh/starknet";
import type { Config } from "https://esm.sh/@apibara/indexer";
import type { Starknet, Block, BlockHeader, EventWithTransaction } from "https://esm.sh/@apibara/indexer/starknet";
import type { Webhook } from "https://esm.sh/@apibara/indexer/sink/webhook";

export const config: Config<Starknet, Webhook> = {
  streamUrl: "https://mainnet.starknet.a5a.ch",
  startingBlock: 54_900,
  network: "starknet",
  filter: {
    header: {
      weak: true,
    },
    events: [
      {
	fromAddress: "0x01b22f7a9d18754c994ae0ee9adb4628d414232e3ebd748c386ac286f86c3066",
	keys: [hash.getSelectorFromName("Transfer")]
      },
    ],
  },
  sinkType: "webhook",
  sinkOptions: {
    targetUrl: "http://localhost:8288/e/env_key",
    raw: true,
  },
};

export default function transform({ header, events }: Block) {
  return events.flatMap((event) => transferToTask(header!, event));
}

function transferToTask(_header: BlockHeader, { event }: EventWithTransaction) {
  const from = BigInt(event.data[0]);
  if (from !== 0n) {
    return [];
  }

  const tokenId = uint256.uint256ToBN({ low: event.data[2], high: event.data[3] }).toString();

  return [{
    name: "nft/mint",
    data: {
      address: event.fromAddress,
      tokenId,
    },
  }];
}
