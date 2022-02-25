package keeper_test

import (
	"context"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	keepertest "github.com/notional-labs/MageNFT/testutil/keeper"
	"github.com/notional-labs/MageNFT/x/magenft/keeper"
	"github.com/notional-labs/MageNFT/x/magenft/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.MagenftKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
