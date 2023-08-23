import { EventSchemas, Inngest } from "https://esm.sh/inngest";

type Events = {
  "nft/mint": {
    data: {
      address: string;
      tokenId: string;
    };
  };
}
export const inngest = new Inngest({
  name: "NFT Metadata Tutorial",
  eventKey: "local",
  schemas: new EventSchemas().fromRecord<Events>(),
});
