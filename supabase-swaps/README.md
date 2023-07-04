# Analyzing on-chain data with Apibara, Supabase and ChatGPT

This tutorial shows how ingest on-chain data into Supabase and then use ChatGPT
to automatically query the data, without writing any SQL!

[**Workshop Recording**](https://twitter.com/Starknet/status/1676200435999444995)

## Project Structure

 - `ai/`: contains the Deno script that uses Langchain together with OpenAI ChatGPT to query data.
 - `apibara/`: contains the Apibara filter and transform to connect Starknet data with Supabase.
 - `supabase/`: contains the Supabase migration to generate the `swaps` table.

