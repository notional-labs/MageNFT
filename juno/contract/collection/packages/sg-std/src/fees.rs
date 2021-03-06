use crate::{create_fund_community_pool_msg, StargazeMsgWrapper, NATIVE_DENOM};
use cosmwasm_std::{coins, BankMsg, CosmosMsg, Decimal, Env, MessageInfo, Uint128};
use cw_utils::{must_pay, PaymentError};
use thiserror::Error;

// governance parameters
const FEE_BURN_PERCENT: u64 = 50;

type SubMsg = CosmosMsg<StargazeMsgWrapper>;
pub fn burn_and_distribute_fee(
    _env: Env,
    info: &MessageInfo,
    fee_amount: u128,
) -> Result<Vec<SubMsg>, FeeError> {
    let payment = must_pay(info, NATIVE_DENOM)?;
    if payment.u128() < fee_amount {
        return Err(FeeError::InsufficientFee(fee_amount, payment.u128()));
    };

    // calculate the fee to burn
    // burn half the fee
    let burn_percent = Decimal::percent(FEE_BURN_PERCENT);
    let burn_fee = Uint128::from(fee_amount) * burn_percent;
    let burn_coin = coins(burn_fee.u128(), NATIVE_DENOM);
    let fee_burn_msg = BankMsg::Burn { amount: burn_coin };

    // Send other half to community pool
    let fund_community_pool_msg =
        create_fund_community_pool_msg(coins(fee_amount - burn_fee.u128(), NATIVE_DENOM));

    Ok(vec![CosmosMsg::Bank(fee_burn_msg), fund_community_pool_msg])
}

#[derive(Error, Debug, PartialEq)]
pub enum FeeError {
    #[error("Insufficient fee: expected {0}, got {1}")]
    InsufficientFee(u128, u128),

    #[error("{0}")]
    Payment(#[from] PaymentError),
}
