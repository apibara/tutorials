import { inngest } from "./client.ts";

export const fetchMetadata = inngest.createFunction(
  { name: "fetchMetadata" },
  { event: "nft/mint" },
  async ({ event, step }) => {
    // ⚡ Use `step.run` to asynchronously run a that may fail. Inngest will
    // automatically retry it if it fails.
    const metadataUrl = await step.run("Fetch token URL", () => {
      // Here we could fetch the metadata URL from the node using an RPC call.
      return `https://cloud.argent-api.com/v1/moments/metadata/1/${event.data.tokenId}`
    });

    const metadata = await step.run("Fetch metadata", async () => {
	const response = await fetch(metadataUrl);
	return await response.json();
    });

    return {
      event,
      body: metadata,
    }
  },
);
