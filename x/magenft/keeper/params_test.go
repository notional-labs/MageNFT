package keeper_test

import (
	"testing"

	testkeeper "github.com/notional-labs/MageNFT/testutil/keeper"
	"github.com/notional-labs/MageNFT/x/magenft/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.MagenftKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
