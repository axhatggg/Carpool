import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const UserHomePage = () => {
  const [pools, setPools] = useState([]);
  const { user } = useAuth();
  const [confPools, setConfPools] = useState([]);
  const navigate = useNavigate();

  const fetchPools = async () => {
    try {
      let res = await axios.get("http://localhost:8000/api/pools/all");
      setPools(res.data);
    } catch (error) {
      console.error("Error fetching pools:", error);
    }
  };

  const fetchConfirmPools = async () => {
    try {
      let res = await axios.get("http://localhost:8000/api/pools/confirm/all");
      setConfPools(res.data);
    } catch (error) {
      console.error("Error fetching pools:", error);
    }
  };

  const handleJoinPool = async (poolId) => {
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `http://localhost:8000/api/pools/join/${poolId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      alert("Successfully joined the pool!");
      fetchPools(); // Refresh the pool list
      fetchConfirmPools();
    } catch (err) {
      // This will correctly show the error message sent from the backend
      // console.error('Error joining pool:', err.response.data.msg);
      alert(err.response.data.msg); // Show alert to the user
    }
  };

  useEffect(() => {
    fetchPools();
    fetchConfirmPools();
  }, []);

  return (
    <>
      <Navbar />

      {user ? (
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="text-3xl font-semibold mb-6">Available Pools 🚗</h1>

          {/* Button to navigate to User Dashboard */}
          <button
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate("/user/dashboard")}
          >
            Go to Dashboard
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <div
                key={pool._id}
                className="bg-red-200 border-2 border-red-700 p-5 rounded-4xl shadow-md flex flex-col "
              >
                {/* <h2 className="text-xl font-bold">From <span className='text-blue-700'>{pool.from}</span>  ➡️ To: <span className='text-green-600'>{pool.to}</span></h2> */}
                <div className="flex ">
                  <h2 className="font-bold underline">From</h2>
                  {/* <h2 className="text-xl font-bold mx-auto">➡️</h2> */}
                  <h2 className=" font-bold underline ml-auto">To</h2>
                </div>

                <div className="flex ">
                  <h2 className="text-xl font-bold">{pool.from}</h2>

                  <h2 className="text-xl font-bold ml-auto">{pool.to}</h2>
                </div>

                <p className="border-2 mx-auto my-2 text-center w-1/2 rounded-4xl text-red-700 font-semibold border-black">
                  {pool.status}
                </p>

                <div className="bg-red-400 rounded-2xl h-auto my-3 p-2 w-auto px-auto">
                  {/* <h2>➡️</h2> */}
                  <p className=" font-semibold ">
                    Created By:-{" "}
                    <span className="text-white">{pool.createdBy.name}</span>
                  </p>
                  <p className={` font-semibold `}>
                    Seats Available:-{" "}
                    <span
                      className={`${
                        pool.seatsAvailable === 0
                          ? "text-red-800"
                          : "text-white"
                      } font-semibold `}
                    >
                      {pool.seatsAvailable}
                    </span>
                  </p>
                  <p className="font-semibold ">
                    Pickup Location:-{" "}
                    <span className="text-white ">{pool.pickupLocation}</span>
                  </p>
                  <p className="font-semibold ">
                    Pickup Time:-{" "}
                    <span className="text-white ">{pool.pickupTime}</span>
                  </p>
                </div>

                <button
                  className="mt-4 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-green-700"
                  onClick={() => handleJoinPool(pool._id)}
                >
                  Join Pool
                </button>
              </div>
            ))}
          </div>

          {/* confirm pools section */}
          <div className="grid grid-cols-1 my-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confPools.map((cpool) => (
              <div
                key={cpool._id}
                className="bg-green-200 border-2 border-green-700 p-5 rounded-4xl shadow-md flex flex-col "
              >
                {/* <h2 className="text-xl font-bold">From <span className='text-blue-700'>{pool.from}</span>  ➡️ To: <span className='text-green-600'>{pool.to}</span></h2> */}
                <div className="flex ">
                  <h2 className="font-bold underline">From</h2>
                  {/* <h2 className="text-xl font-bold mx-auto">➡️</h2> */}
                  <h2 className=" font-bold underline ml-auto">To</h2>
                </div>

                <div className="flex ">
                  <h2 className="text-xl font-bold">{cpool.from}</h2>

                  <h2 className="text-xl font-bold ml-auto">{cpool.to}</h2>
                </div>

                <p className="border-2 mx-auto my-2 text-center w-1/2 rounded-4xl text-green-950 font-semibold border-black">
                  {cpool.status}
                </p>

                <div className="bg-green-300 rounded-2xl h-auto my-3 p-2 w-auto px-auto">
                  {/* <h2>➡️</h2> */}
                  <p className=" font-semibold ">
                    Created By:-{" "}
                    <span className="text-white">{cpool.createdBy.name}</span>
                  </p>
                  <p className={` font-semibold `}>
                    Seats Available:-{" "}
                    <span
                      className={`${
                        cpool.seatsAvailable === 0
                          ? "text-red-800"
                          : "text-white"
                      } font-semibold `}
                    >
                      {cpool.seatsAvailable}
                    </span>
                  </p>
                  <p className="font-semibold ">
                    Pickup Location:-{" "}
                    <span className="text-white ">{cpool.pickupLocation}</span>
                  </p>
                  <p className="font-semibold ">
                    Pickup Time:-{" "}
                    <span className="text-white ">{cpool.pickupTime}</span>
                  </p>
                </div>

                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => handleJoinPool(cpool._id)}
                >
                  Join Pool
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
        <div className="w-screen h-screen flex justify-center relative ">
          {/* Blurred background elements */}
          <div className="fixed top-0 left-0 w-1/4 h-1/2 bg-blue-300 rounded-full opacity-30 blur-xl -z-10" />
          <div className="fixed bottom-0 -right-28 w-1/4 h-1/2 bg-fuchsia-300 rounded-full opacity-30 blur-xl -z-10" />
          <div className="fixed -bottom-56 w-1/2 h-1/2 bg-orange-300 rounded-full opacity-30 blur-3xl -z-10" />

          <div className="flex flex-col items-center w-full px-4">
            <h1 className="text-3xl md:text-5xl font-black font-serif text-center md:w-1/2 w-full my-10 md:my-20">
              <span className="text-pink-600">Looking</span> for a partner to
              share a <span className="text-amber-500">ride</span> with?
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-around w-full gap-10">
              <div className="relative flex flex-col gap-3 w-full md:w-1/3">
                <div className="absolute left-0 top-0 h-1/3 bg-amber-500 opacity-10 -z-10 rounded-2xl w-full" />

                <div className="font-semibold px-5 font-serif text-3xl md:text-4xl">
                  What do we offer?
                </div>
                <p className="text-base md:text-xl text-gray-500 font-light p-2">
                  Go anywhere, everywhere by saving the cost of travelling
                  alone. Beat the hot summer by travelling in our AC cars with
                  someone to share the ride with and fare with.
                </p>
              </div>

              <img
                src="https://images.nightcafe.studio/jobs/PJ9X4hTG1zxZQdhZBqQ7/PJ9X4hTG1zxZQdhZBqQ7--1--hxdi7.jpg?tr=w-1600,c-at_max"
                alt="Ride sharing"
                className="w-1/2 md:w-1/4 rounded-3xl shadow-black shadow-2xl object-cover max-w-md"
              />
            </div>
          </div>
        </div>
        <div className="bg-lime-100 w-screen h-screen">
          <div className="flex flex-col items-center w-full px-4">
            <h1 className="text-3xl md:text-5xl font-black font-serif text-center md:w-1/2 w-full my-10 md:my-20">
              <span className="text-pink-600">Join</span> the ride <span className="text-amber-500">cut</span> the carbon.
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-around w-full gap-10">
              
                
                <img
                src="\use.jpg"
                alt="Ride sharing"
                className="w-1/2 md:w-1/5 rounded-3xl shadow-black shadow-2xl object-cover max-w-md"
                />
                <div className="relative flex flex-col gap-3 w-full md:w-1/3">
                <div className="absolute left-0 top-0 h-1/3 bg-amber-500 opacity-10 z-10 rounded-2xl w-full" />
                <div className="font-semibold px-5 font-serif text-3xl md:text-4xl">
                  Helping Society
                </div>
                <p className="text-base md:text-xl text-gray-500 font-light p-2">
                  Join a smarter, greener way to travel. By sharing your ride, you help reduce traffic, cut down on harmful emissions, and make the planet a cleaner place—one trip at a time.
                </p>
              </div>

              
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default UserHomePage;
