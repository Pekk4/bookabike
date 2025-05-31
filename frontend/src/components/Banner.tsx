const Banner = () => {
  const handleLogin = () => {
    console.log('Login button clicked'); // TODO
  };

  return (
    <div className="fixed top-0 mx-auto left-0 right-0">
      <div className="bg-[url(./assets/images/logo.png)] bg-no-repeat absolute top-7 w-[179px] mx-auto left-0 right-0 h-[71px]"></div>
      <div className="bg-gradient-to-b from-org-gray to-black w-screen grid grid-cols-1 border-b-2 border-orange-500">
        <div className="flex flex-col sm:flex-row justify-start items-center">
          <div
            className="
              hover:cursor-pointer
              text-white
              hover:text-orange-500
              font-med
              sm:inline-block
              px-[13px]
              py-5"
          >
            <p>Moottoripyora.org</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleLogin}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
