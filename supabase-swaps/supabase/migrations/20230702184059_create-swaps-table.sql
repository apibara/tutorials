create table if not exists swaps(
    -- pool data
    exchange text,
    token0 text,
    token1 text,
    pair text,
    -- blockchain data
    block_number bigint,
    block_time timestamp,
    transaction_hash text,
    -- swap data
    amount0_in numeric,
    amount1_in numeric,
    amount0_out numeric,
    amount1_out numeric,
    sender_address text,
    to_address text,
    -- derived data
    token0_price numeric,
    token1_price numeric,
    -- needed by integration
    _cursor bigint
);