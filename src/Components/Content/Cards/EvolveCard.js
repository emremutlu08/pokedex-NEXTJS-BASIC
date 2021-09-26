import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Loading } from '../../Informative';
import useFetch from 'react-fetch-hook';
import PokemonCard from '../PokemonCard';
import { capitalizer } from '../../../utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const EvolveCard = (props) => {
  const matches = useMediaQuery('(max-width:1279px)');
  const { evolveChain } = props;

  if (!!!evolveChain)
    return <Box sx={centerStyle}>Error... {`"${pokemon}" is not exists!`}</Box>;
  console.log(evolveChain, ':162');
  let newChain = [evolveChain];
  console.log(newChain, ':164');
  let addToChain = [];
  for (let i = 0; i < 10; i++) {
    if (!newChain.length) {
      console.log('Chain ends!');
      break;
    }
    const evolveDetails = newChain[0].evolution_details[0];
    addToChain.push({
      name: newChain[0].species.name,
      minLevel: evolveDetails ? evolveDetails.min_level : null,
      trigger: evolveDetails ? evolveDetails.trigger.name : null,
    });
    console.log(newChain, ':170');
    console.log(evolveDetails, ':171');
    console.log(newChain[0].evolves_to, ':172');
    newChain = [...newChain[0].evolves_to];
  }
  console.log(addToChain, ':176');
  const desktopStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const mobileStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const evolveStyle = matches
    ? {
        display: 'flex',
        width: 200,
        justifyContent: 'space-between',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 110,
      };
  return (
    <Box sx={matches ? mobileStyle : desktopStyle}>
      {addToChain.map((item) => {
        const pokemonData = useFetch(
          `https://pokeapi.co/api/v2/pokemon/${item.name}`,
        );
        if (pokemonData.isLoading) return <Loading />;
        console.log(item, ':188');
        console.log(item.name, ':189');
        return (
          <>
            {item.trigger && (
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  {item.minLevel ? (
                    <Box sx={evolveStyle}>
                      <Box sx={{ width: 24, height: 24 }}>
                        <Image
                          alt="Rare Candy"
                          src={
                            'https://cdn2.bulbagarden.net/upload/8/8d/Bag_Rare_Candy_Sprite.png'
                          }
                          width={24}
                          height={24}
                        />
                      </Box>{' '}
                      <Box>Level {item.minLevel}</Box>
                      {matches ? <ArrowDownwardIcon /> : <ArrowForwardIcon />}
                    </Box>
                  ) : (
                    <Box sx={evolveStyle}>
                      <CompareArrowsIcon />
                      <Box>{capitalizer(item.trigger)}</Box>
                      {matches ? <ArrowDownwardIcon /> : <ArrowForwardIcon />}
                    </Box>
                  )}
                </Typography>
              </Card>
            )}
            <Box sx={{ height: 10 }} />
            <PokemonCard data={pokemonData.data} />
            <Box sx={{ height: 10 }} />
          </>
        );
      })}
    </Box>
  );
};

export default EvolveCard;