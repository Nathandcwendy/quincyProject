import { useContext, useEffect, useState } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [page, setPage] = useState();
  const location = useLocation();

  const paths = [
    { link: "/", page: "home", description: "Home" },
    { link: "/report", page: "report", description: "Report Drug" },
  ];

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname == "/") {
      setPage("home");
    } else if (
      location.pathname.split("/").slice(1)[0].toLowerCase() == "report"
    ) {
      setPage("report");
    }
  }, [location]);

  return (
    <header className="sticky top-4 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-base">
      <nav
        className="relative max-w-[85rem] w-full bg-white border border-gray-200 rounded-[36px] mx-2 py-3 px-4 sm:flex sm:items-center sm:justify-between sm:py-0 sm:px-6 lg:px-8 xl:mx-auto dark:bg-gray-900 dark:border-gray-700 shadow-custom-1 dark:shadow-gray-800 pb-4 sm:pb-0"
        aria-label="Global"
      >
        <div className="flex items-center justify-between">
          <Link
            to={"/"}
            className="flex-none text-base xs:text-xl font-semibold dark:text-white"
            aria-label="Drug Verification System"
          >
            Drug Verification System
          </Link>
          <div className="sm:hidden">
            <button
              type="button"
              className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-full border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
            >
              <svg
                className="hs-collapse-open:hidden w-4 h-4"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                ></path>
              </svg>
              <svg
                className="hs-collapse-open:block hidden w-4 h-4"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
            {paths.map((i, index) =>
              page == i.page ? (
                <div key={index} className="sm:py-4">
                  <Link
                    to={`${i.link}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-500  dark:hover:text-blue-600 block"
                  >
                    {i.description}
                  </Link>
                </div>
              ) : (
                <div key={index} className="sm:py-4">
                  <Link
                    to={`${i.link}`}
                    className="font-medium hover:text-gray-400 dark:hover:text-gray-500 block"
                  >
                    {i.description}
                  </Link>
                </div>
              )
            )}
            {theme === "light" ? (
              <button
                className="hs-dark-mode group flex items-center text-gray-600 hover:text-blue-600 font-medium dark:text-gray-400 dark:hover:text-gray-500 p-2 pl-0"
                href="#"
                onClick={() => {
                  theme === "dark" ? setTheme("light") : setTheme("dark");
                }}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                </svg>
              </button>
            ) : (
              <button
                className="flex hs-dark-mode group items-center text-gray-600 hover:text-blue-600 font-medium dark:text-gray-400 dark:hover:text-gray-500 p-2 pl-0"
                href="#"
                onClick={() => {
                  theme === "dark" ? setTheme("light") : setTheme("dark");
                }}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
