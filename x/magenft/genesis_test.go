package magenft_test

import (
	"testing"

	keepertest "github.com/notional-labs/MageNFT/testutil/keeper"
	"github.com/notional-labs/MageNFT/testutil/nullify"
	"github.com/notional-labs/MageNFT/x/magenft"
	"github.com/notional-labs/MageNFT/x/magenft/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.MagenftKeeper(t)
	magenft.InitGenesis(ctx, *k, genesisState)
	got := magenft.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
