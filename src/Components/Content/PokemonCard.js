import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NextImage from 'next/image';
const Image = props => <NextImage loader={({ src }) => src} unoptimized {...props} />;
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import chipStlyes from './ChipStyles.json';
import { lightBlue } from '@mui/material/colors';
import { capitalizer } from '../../utils';

const PokemonCard = (props) => {
  const { data } = props;
  return (
    <Card sx={{ backgroundColor: lightBlue[50] }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Image
            alt="Pokemon"
            // src="/assets/pokeball.png"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              data.id ? data.id : data.name
            }.png`}
            width={125}
            height={125}
          />
          <Box>
            <Typography variant="h6" display="block" gutterBottom>
              {data.name.toUpperCase()} {data.id && <span>#{data.id}</span>}
            </Typography>
            <Box sx={{ mb: 1.5, gap: 2, display: 'flex' }}>
              {data.types.map((type) => {
                return (
                  <Chip
                    key={`${type}}${Math.random()}`}
                    size="small"
                    label={capitalizer(type.type.name)}
                    sx={chipStlyes[0][type.type.name]}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
