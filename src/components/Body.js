import RestaurantCard, { withPromotedRestaurantCard } from "./RestaurantCard";

import ChickenRestaurantCard from "./ChickenRestaurantCard";

import { useState, useEffect, useContext } from "react";

import Shimmer from "./Shimmer";

import { CHICKEN_SHOP_LIST_URL, SWIGGY_LIST_API } from "./utils/constants";

import { Link } from "react-router-dom";

import useOnlineStatus from "./utils/useOnlineStatus";
import UserContext from "./utils/UserContext";

const Body = () => {
  // state var - super powerful var - use a hook => useState
  const [restaurants, setRestaurants] = useState([]);
  const [filteredSearchList, setFilteredSearchList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const onlineStatus = useOnlineStatus();

  console.log("onlineStatus", onlineStatus);

  const PromoteRestaurantCard = withPromotedRestaurantCard(RestaurantCard);

  const { setUserName, loggedInUser } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetch(SWIGGY_LIST_API);
      const json = await data.json();
      console.log(" fetched resaturants data ", json);
      console.log(
        "resaturants data",
        json.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle.restaurants
      );
      setRestaurants(
        json.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle.restaurants
      );
      setFilteredSearchList(
        json.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle.restaurants
      );
      //setRestaurants(json.meals)
      //setFilteredSearchList(json.meals)
    } catch (error) {
      console.error("Failed to fetch", error);
      setFilteredSearchList([]);
      setRestaurants([]);
    }
  };

  if (onlineStatus === false) return <h1>Looks like you are offline</h1>;

  return restaurants?.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="filter flex flex-col md:flex-row justify-between items-center">
        <div className="search flex items-center space-x-4 m-4 p-4">
          <input
            type="text"
            className="border border-solid border-black rounded-lg px-4 py-2"
            placeholder="Search Restaurants..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={() => {
              const filteredSearchedData = restaurants.filter((res) =>
                res.info.name.toLowerCase().includes(searchText.toLowerCase())
              );
              setFilteredSearchList(filteredSearchedData);
            }}
          >
            Search
          </button>
        </div>
        <div className="search flex items-center space-x-4 m-4 p-4">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            onClick={() => {
              if (Array.isArray(restaurants)) {
                const filteredListOfRestaurants = restaurants.filter(
                  (res) => res.info?.avgRating >= 4
                );
                setFilteredSearchList(filteredListOfRestaurants);
              } else {
                console.error("restaurants is not an array");
              }
            }}
          >
            Top Rated Restaurants
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">User Name:</label>
            <input
              type="text"
              className="border border-black rounded-lg px-4 py-2 bg-gray-100"
              placeholder="Enter your name"
              value={loggedInUser}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        {Array.isArray(filteredSearchList) && filteredSearchList.length > 0 ? (
          filteredSearchList.map((restaurant, index) => (
            // <ChickenRestaurantCard key={restaurant.idMeal} restaurant={restaurant} />
            <Link
              to={"/restaurants/" + restaurant.info.id}
              key={restaurant.info.id + index}
            >
              {restaurant.info.promoted ? (
                <PromoteRestaurantCard restaurant={restaurant} />
              ) : (
                <RestaurantCard restaurant={restaurant} />
              )}
            </Link>
          ))
        ) : (
          <p>No Restaurants Found</p>
        )}
      </div>
    </div>
  );
};

export default Body;
