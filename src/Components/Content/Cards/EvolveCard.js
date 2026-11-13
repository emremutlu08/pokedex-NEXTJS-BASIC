import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Loading } from '../../Informative';
import useFetch from 'react-fetch-hook';
import PokemonCard from '../PokemonCard';
import { capitalizer } from '../../../utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import NextImage from 'next/image';
const Image = props => <NextImage loader={({ src }) => src} unoptimized {...props} />;
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Link from './../../../Link';

const EvolveCard = (props) => {
  const matches = useMediaQuery('(max-width:1279px)');
  const { evolveChain } = props;
  console.log(evolveChain, ':18');
  if (!!!evolveChain)
    return <Box sx={centerStyle}>Error... {`"${pokemon}" is not exists!`}</Box>;
  let newChain = [evolveChain];
  let addToChain = [];
  for (let i = 0; i < 10; i++) {
    if (!newChain.length) {
      break;
    }
    const evolveDetails = newChain[0].evolution_details[0];
    addToChain.push({
      name: newChain[0].species.name,
      minLevel: evolveDetails ? evolveDetails.min_level : null,
      trigger: evolveDetails ? evolveDetails.trigger.name : null,
    });
    newChain = [...newChain[0].evolves_to];
  }
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
        return (
          <>
            {item.trigger && (
              <Card sx={{ m: 1, p: 1, textAlign: 'center' }} key={item.name}>
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
                      <Box>
                        {capitalizer(item.trigger)}
                        {evolveChain.evolves_to.length > 1 && (
                          <Box>
                            And {evolveChain.evolves_to.length} other forms
                          </Box>
                        )}
                      </Box>
                      {matches ? <ArrowDownwardIcon /> : <ArrowForwardIcon />}
                    </Box>
                  )}
                </Typography>
              </Card>
            )}
            <Box sx={{ height: 10 }} />
            <Link href={`/pokemon/${pokemonData.data.id}`}>
              <PokemonCard data={pokemonData.data} />
            </Link>
            <Box sx={{ height: 10 }} />
          </>
        );
      })}
    </Box>
  );
};

export default EvolveCard;
