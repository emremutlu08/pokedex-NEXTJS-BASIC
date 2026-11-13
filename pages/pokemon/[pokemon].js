import { useRouter } from 'next/router';
import useFetch from 'react-fetch-hook';

import MoveContent from '../../src/Components/Content/MoveContent';
import PokemonCard from '../../src/Components/Content/PokemonCard';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Loading } from '../../src/Components/Informative';
import axios from 'axios';

/* Custom Components */
// Cards
import BasicInfoCard from './../../src/Components/Content/Cards/BasicInfoCard';
import EvolveCard from './../../src/Components/Content/Cards/EvolveCard';
import StatsCard from './../../src/Components/Content/Cards/StatsCard';

// Every Pokémon page is generated at build time so the site can be served as static files.
const POKEMON_COUNT = 898;
export async function getStaticPaths() {
  return {
    paths: Array.from({ length: POKEMON_COUNT }, (_, index) => ({ params: { pokemon: String(index + 1) } })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { pokemon } = context.params;
  if (pokemon > 898)
    return {
      props: { pokemonData: null, evolveChain: null }, // will be passed to the page component as props
    };
  const pokemonData = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
  );
  const fetchChain = await axios.get(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`,
  );
  const chainUrl = fetchChain.data.evolution_chain.url;
  const getChain = await axios.get(chainUrl);
  return {
    props: { pokemonData: pokemonData.data, evolveChain: getChain.data.chain }, // will be passed to the page component as props
  };
}

export default function PokemonDetails(props) {
  const { pokemonData, evolveChain } = props;
  const matches = useMediaQuery('(max-width:600px)');
  const style = matches ? { p: 1 } : { p: 10 };
  const router = useRouter();
  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  if (!router.isReady) return <Loading />;
  const pokemon = router.query.pokemon;
  if (pokemon > 898) return <Box sx={style}>Pokemon not found!</Box>;
  if (!!!pokemonData || !!!evolveChain)
    return <Box sx={centerStyle}>Error... {`"${pokemon}" is not exists!`}</Box>;
  return (
    <Box sx={style}>
      <PokemonCard data={pokemonData} />
      <Box sx={{ height: 20 }} />
      <BasicInfoCard data={pokemonData} />
      <Box sx={{ height: 20 }} />
      <EvolveCard evolveChain={evolveChain} />
      <Box sx={{ height: 20 }} />
      <StatsCard data={pokemonData} />
      <Box sx={{ height: 20 }} />
      <MoveContent pokemonData={pokemonData} />
    </Box>
  );
}
