import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Image from 'next/image';
import TextField from '@mui/material/TextField';
import { useDebounce } from 'use-debounce';
import { matchSorter } from 'match-sorter';
import Stories from 'react-insta-stories';
import Modal from '@mui/material/Modal';
import useFetch from 'react-fetch-hook';
import Link from '../../Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Loading } from '../Informative';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function MyPokemons() {
  const [item, setItem] = useLocalStorage('list', []);
  const matches = useMediaQuery('(max-width:600px)');
  const [text, setText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [openStory, setOpenStory] = useState(false);
  const [selectedResult, setSelectedResult] = useState({});
  const [value] = useDebounce(text, 1000);
  const handleClose = () => {
    setOpenStory(false);
  };
  React.useEffect(() => {
    let result = matchSorter(item, value, { keys: ['name', 'id'] });

    // Sort Pokémons by Id
    result.sort((a, b) => {
      let keyA = ('0000' + a.id).slice(-5),
        keyB = ('0000' + b.id).slice(-5);
      // Compare the 2 ids
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    // Show at most 36 Pokémons
    result = result.slice(0, 36);
    setSearchResults(result);
  }, [value, item]);

  function App() {
    return (
      <Stories
        keyboardNavigation
        defaultInterval={5000}
        stories={stories2}
        width={matches ? 200 : 400}
        height={555}
        onStoryEnd={(s, st) => console.log('story ended', s, st)}
        onAllStoriesEnd={handleClose}
        onStoryStart={(s, st) => console.log('story started', s, st)}
        storyContainerStyles={{
          borderRadius: 8,
          overflow: 'hidden',
          margin: 'auto',
          marginTop: 8,
        }}
      />
    );
  }

  const contentStyle = {
    background: '#333',
    width: '100%',
    padding: 20,
    // paddingBottom: 800,
    color: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const pokemonData = useFetch(
    `https://pokeapi.co/api/v2/pokemon/${selectedResult.id}`,
  );
  const stories2 = [
    {
      content: (props) => {
        const { action, isPaused } = props;

        if (pokemonData.isLoading) return <Loading />;
        return (
          <div style={contentStyle}>
            <h1>Default</h1>
            <Image
              alt="Pokemon"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedResult.id}.png`}
              width={125}
              height={125}
            />
            <Image
              alt="Pokemon"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${selectedResult.id}.png`}
              width={125}
              height={125}
            />
          </div>
        );
      },
    },
    {
      content: (props) => {
        const { action, isPaused } = props;

        if (pokemonData.isLoading) return <Loading />;
        return (
          <div style={contentStyle}>
            <h1>Shiny</h1>
            <Image
              alt="Pokemon"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${selectedResult.id}.png`}
              width={125}
              height={125}
            />
            <Image
              alt="Pokemon"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${selectedResult.id}.png`}
              width={125}
              height={125}
            />
          </div>
        );
      },
    },
  ];
  console.log(item, ':148');
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          id="outlined-basic"
          label="Search Pokémon"
          variant="outlined"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
          fullWidth
        />
      </Box>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Link href="/">
                <Button variant="contained">All Pokémons</Button>
              </Link>
              <Link href="/my-pokemons">
                <Button variant="outlined">My Pokémons</Button>
              </Link>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 4 }} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {searchResults.map((result) => {
              return (
                <Grid
                  item
                  key={`${result}${Math.random()}`}
                  xs={6}
                  sm={4}
                  md={2}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Avatar
                      sx={{ width: 100, height: 100, cursor: 'pointer' }}
                      onClick={() => {
                        setOpenStory(true);
                        setSelectedResult(result);
                      }}
                    >
                      <Image
                        alt="Pokemon"
                        placeholder="blur"
                        // blurDataURL="/assets/pokeball.png"
                        blurDataURL={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`}
                        width={90}
                        height={90}
                      />
                    </Avatar>
                    {item.includes(result) ? (
                      <IconButton
                        aria-label="remove"
                        color="primary"
                        sx={{ width: 20, height: 20 }}
                        onClick={() => {
                          setItem(item.filter((pokemon) => pokemon !== result));
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="add"
                        color="primary"
                        sx={{ width: 20, height: 20 }}
                        onClick={() => {
                          setItem((prevPokemon) => {
                            if (prevPokemon.includes(result))
                              return [...prevPokemon];
                            return [...prevPokemon, result];
                          });
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                      ml: 1,
                    }}
                  >
                    <Typography variant="overline" display="block" gutterBottom>
                      {result.name.toUpperCase()} #{result.id}
                    </Typography>
                    <Link href={`/pokemon/${result.id}`} color="secondary">
                      <Button variant="contained">See Details</Button>
                    </Link>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>

        <Modal
          open={openStory}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <App pokemonResult={selectedResult} />
        </Modal>
      </main>
    </>
  );
}