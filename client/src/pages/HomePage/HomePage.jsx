// import { useDispatch, useSelector } from "react-redux";
// import { addNewHobby, setActiveHobby } from "../../actions/hobby";
// import HobbyList from "../.components/HomePage/HobbList/HobbList";

// const randomNumber = () => {
//   return 1000 + Math.trunc(Math.floor(Math.random() * 9000));
// };

function HomePage(props) {
  // const hobbyList = useSelector((state) => state.hobby.list);
  // const activeId = useSelector((state) => state.hobby.activeId);

  // const dispatch = useDispatch();

  // const handleAddHobbyClick = () => {
  //   const newId = randomNumber();
  //   const newHobby = {
  //     id: newId,
  //     title: `Hobby ${newId}`,
  //   };
  //   const action = addNewHobby(newHobby);
  //   dispatch(action);
  // };

  // const onHobbyClick = (hobby) => {
  //   const action = setActiveHobby(hobby);
  //   dispatch(action);
  // };

  return (
    <div className="home-page">
      <h1>Home Page</h1>
      {/* <button onClick={handleAddHobbyClick}>Random hobby</button>
      <HobbyList
        hobbyList={hobbyList}
        activeId={activeId}
        onHobbyClick={onHobbyClick}
      /> */}
    </div>
  );
}

export default HomePage;
