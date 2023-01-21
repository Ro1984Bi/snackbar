import { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { ThemeContext } from "../../App";
import FavoriteItem from "../../components/favorite-item";
import RecipeItem from "../../components/recipes-item";
import Search from "../../components/search";
import "./style.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "filterFavorites":
      return {
        ...state,
        filteredValue: action.value
      }

    default:
      return state;
  }
};

const initialState = {
  filteredValue: "",
};

function Homepage() {
  //loading

  const [loading, setLoading] = useState(false);

  //favorites state

  const [favorites, setFavorites] = useState([]);

  //save results

  const [recipes, setRecipes] = useState([]);

  //state of api

  const [callApi, setCallApi] = useState(false);

  //use reducer

  const [filteredState, dispatch] = useReducer(reducer, initialState);
  const {theme} = useContext(ThemeContext)

  const getDataFromSearchComponent = (getData) => {
    setLoading(true);

    //call the api
    const getRecipes = async () => {
      const apiResponse = await fetch(
        ` https://api.spoonacular.com/recipes/complexSearch?apiKey=89e17c6773d0492384e94d43886f1753&query=${getData}`
      );
      const result = await apiResponse.json();
      const { results } = result;

      if (results && results.length > 0) {
        setLoading(false);
        setRecipes(results);
        setCallApi(true);
      }
    };

    getRecipes();
  };

  const addToFavorites = useCallback((getCurrentRecipeItem) => {
    let copyFavorites = [...favorites];

    const index = copyFavorites.findIndex(
      (item) => item.id === getCurrentRecipeItem.id
    );
    console.log(index);
    if (index === -1) {
      copyFavorites.push(getCurrentRecipeItem);
      setFavorites(copyFavorites);
      //localStorage
      localStorage.setItem("favorites", JSON.stringify(copyFavorites));
    } else {
      alert("This recipe was added");
    }
  }, [favorites])



  const removeFromFavorites = (getCurrentId) => {
    let copyFavorites = [...favorites];
    copyFavorites = copyFavorites.filter((item) => item.id !== getCurrentId);

    setFavorites(copyFavorites);
    localStorage.setItem("favorites", JSON.stringify(copyFavorites));
    window.scrollTo({top : '0', behavior : 'smooth'})
  };

  useEffect(() => {
    const extract = JSON.parse(localStorage.getItem("favorites"));
    setFavorites(extract);
  }, []);

  

  //select from favorites

  const searchFromFavorites = favorites.filter(item => 
    item.title.toLowerCase().includes(filteredState.filteredValue)
    ) 

    const renderRecipes = useCallback(() => {
      if (recipes && recipes.length > 0) {
        return (
          recipes.map((item) => (
            <RecipeItem
              addToFavorites={() => addToFavorites(item)}
              id={item.id}
              image={item.image}
              title={item.title}
            />
          ))
        )
      }
    }, [recipes, addToFavorites])

  return (
    <div className="homepage">
      <Search
        getDataFromSearchComponent={getDataFromSearchComponent}
        callApi={callApi}
        setCallApi={setCallApi}
      />

      <div className="favorites-wrapper">
        <h1 style={theme ? {  color : '#12343b'} : {}} className="favorites-title">Favorites</h1>

        <div className="search-favorites">
          <input
            onChange={(e) =>
              dispatch({ type: "filterFavorites", value: e.target.value })
            } 
            value={filteredState.filteredValue}
            name="searchfavorites"
            placeholder="Search Favorites"
          />
        </div>

        <div className="favorites">
          {
            !searchFromFavorites.length && <div style={{display : 'flex', width : '100%', justifyContent : 'center'}} className="no-item">No favorites found</div>
          }
          {searchFromFavorites && searchFromFavorites.length > 0
            ? searchFromFavorites.map((item) => (
                <FavoriteItem
                  removeFromFavorites={() => removeFromFavorites(item.id)}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                />
              ))
            : null}
        </div>
      </div>
      {loading && <div className="loading">Loading recipes ! Please wait</div>}
      <div className="items">
        {
           renderRecipes()
        }
     {/*   {recipes && recipes.length > 0
          ? recipes.map((item) => (
              <RecipeItem
                addToFavorites={() => addToFavorites(item)}
                id={item.id}
                image={item.image}
                title={item.title}
              />
            ))
          : null} */}
      </div>
      {
        !loading && !recipes.length && <div className="no-item">No Recipes are found</div>
      }
    </div>
  );
}

export default Homepage;
