import * as React from 'react';
import { useState } from 'react';
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
import NextImage from 'next/image';
const Image = props => <NextImage loader={({ src }) => src} unoptimized {...props} />;
import TextField from '@mui/material/TextField';
import { useDebounce } from 'use-debounce';
import { matchSorter } from 'match-sorter';
import Stories from 'react-insta-stories';
import Modal from '@mui/material/Modal';
import useFetch from 'react-fetch-hook';
import Link from './../../Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Loading } from '../Informative';
import useLocalStorage from '../../hooks/useLocalStorage';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { capitalizer } from '../../utils';

const useStyles = makeStyles({
  cont: {
    background: '-webkit-linear-gradient(left top, crimson 0%, #f90 100%)',
    borderRadius: '50%',
    padding: '5px',
  },
  contClicked: {
    background: grey[500],
    borderRadius: '50%',
    padding: '5px',
  },
  box: {
    background: grey[900],
    borderRadius: '50%',
    margin: 1,
  },
  ballBorder: {
    background: '-webkit-linear-gradient(left top, crimson 0%, #f90 100%)',
    borderRadius: '50%',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const objectIncludes = (array, searchFor) => {
  return array.some((x) => JSON.stringify(x) === JSON.stringify(searchFor));
};

export default function PokemonLister(props) {
  let { pokemonlist } = props;
  pokemonlist = !!pokemonlist ? JSON.parse(pokemonlist) : null;
  const notifyCatched = (name) =>
    toast(`You catch ${capitalizer(name)}!`, {
      icon: ({ theme, type }) => (
        <Box className={classes.ballBorder}>
          <Image
            alt="Pokemon"
            placeholder="blur"
            blurDataURL="/assets/pokeball.png"
            src={`/assets/pokeball.png`}
            width={50}
            height={50}
            className={classes.ballBorder}
          />
        </Box>
      ),
    });
  const notifyReleased = (name) =>
    toast(`You release ${capitalizer(name)}!`, {
      icon: ({ theme, type }) => (
        <Image
          alt="Pokemon"
          placeholder="blur"
          blurDataURL="/assets/pokeball-open.png"
          src={`/assets/pokeball-open.png`}
          width={50}
          height={50}
          className={classes.ballBorder}
        />
      ),
    });
  const classes = useStyles(props);
  const [item, setItem] = useLocalStorage('list', []);
  const [viewedStories, setViewedStories] = useLocalStorage('story', []);
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
    let result = matchSorter(pokemonlist ? pokemonlist : item, value, {
      keys: ['name', 'id'],
    });

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
  }, [value, item, viewedStories]);
  function App() {
    return (
      <Stories
        keyboardNavigation
        defaultInterval={5000}
        stories={stories2}
        width={matches ? 200 : 400}
        height={555}
        onAllStoriesEnd={handleClose}
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
      content: () => {
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
      content: () => {
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
            pt: 2,
            pb: 2,
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
                <Button variant="outlined">My Pokémons ({item.length})</Button>
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
                    <Box
                      className={
                        objectIncludes(viewedStories, result)
                          ? classes.contClicked
                          : classes.cont
                      }
                    >
                      <Avatar
                        className={classes.box}
                        sx={{ width: 100, height: 100, cursor: 'pointer' }}
                        onClick={() => {
                          setViewedStories((prevPokemon) => {
                            if (objectIncludes(prevPokemon, result))
                              return [...prevPokemon];
                            return [...prevPokemon, result];
                          });
                          setOpenStory(true);
                          setSelectedResult(result);
                        }}
                      >
                        {objectIncludes(item, result) && !!pokemonlist ? (
                          <Image
                            alt="Pokemon"
                            placeholder="blur"
                            blurDataURL="/assets/pokeball.png"
                            src={`/assets/pokeball.png`}
                            width={90}
                            height={90}
                          />
                        ) : (
                          <Image
                            alt="Pokemon"
                            placeholder="blur"
                            // blurDataURL="/assets/pokeball.png"
                            blurDataURL={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`}
                            width={90}
                            height={90}
                          />
                        )}
                      </Avatar>
                    </Box>
                    {objectIncludes(item, result) ? (
                      <IconButton
                        aria-label="remove"
                        color="primary"
                        sx={{ width: 20, height: 20 }}
                        onClick={() => {
                          notifyReleased(result.name);
                          setItem(
                            item.filter(
                              (pokemon) =>
                                JSON.stringify(pokemon) !==
                                JSON.stringify(result),
                            ),
                          );
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
                          notifyCatched(result.name);
                          setItem((prevPokemon) => {
                            if (objectIncludes(prevPokemon, result))
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ backgroundColor: '#121212', color: '#eee' }}
      />
    </>
  );
}
