import "../styles/App.scss";
import callToApi from "../services/api";
import { useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Filters from "./Filters";
import CharacterList from "./CharacterList";
import CharacterDetail from "./CharacterDetail";
import ls from "../services/localStorage";

console.log("( => Ready! )");

function App() {
  // Estado
  const [data, setData] = useState([]);
  const [filterName, setFilterName] = useState(ls.get("filterName", ""));
  const [filterHouse, setFilterHouse] = useState(ls.get("filterHouse", "Gryffindor"));
  const [filterGender, setFilterGender] = useState(ls.get("filterGender", ""));

  // Variables
  const infoRoute = useRouteMatch("/character/:characterId");

  // LocalStorage
  useEffect(() => {
    ls.set("filterName", filterName);
    ls.set("filterHouse", filterHouse);
    ls.set("filterGender", filterGender);
  }, [filterName, filterHouse, filterGender]);

  // Api
  useEffect(() => {
    callToApi(filterHouse).then((response) => {
      setData(response);
    });
  }, [filterHouse]);

  // Handle Functions
  const handleChangeFilterName = (value) => {
    setFilterName(value);
  };
  const handleChangeFilterHouse = (value) => {
    setFilterHouse(value);
  };
  const handleChangeFilterGender = (value) => {
    setFilterGender(value);
  };
  const handleBtnReset = () => {
    setFilterName('');
    setFilterHouse('Gryffindor');
    setFilterGender('');
  }

  // Filtered functions
  const filteredCharacters = data
  .filter((character) => {
    return character.name.toLowerCase().includes(filterName.toLowerCase());
  })
  .filter((character) => {
    return filterGender === '' ? true : character.gender === filterGender;
  })

  // Render Functions
  const renderCharacterDetail = () => {
    if (infoRoute !== null) {
      const routerId = parseInt(infoRoute.params.characterId);
      const foundCharacter = data.find(
        (character) => character.id === routerId
      );
      return foundCharacter;
    }
  };

  // React Render HTML
  return (
    <>
      <header>
        <h1>Expecto Patronum!</h1>
      </header>

      <main>
        <Switch>
          <Route exact path="/">
            <Filters
              filterName={filterName}
              filterHouse={filterHouse}
              filterGender={filterGender}
              handleChangeFilterName={handleChangeFilterName}
              handleChangeFilterHouse={handleChangeFilterHouse}
              handleChangeFilterGender={handleChangeFilterGender}
            />
            <button onClick={handleBtnReset}>Reset</button>
            <CharacterList data={filteredCharacters} filterName={filterName} />
          </Route>
          <Route path="/character/:characterId">
            <CharacterDetail data={renderCharacterDetail()} />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
