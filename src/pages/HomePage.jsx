import { useState, useContext, useEffect, useRef } from "react";
import DataContext from "../contexts/DataContext";
import { MdErrorOutline, MdCheckCircle, MdOutlineError } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  const {
    setDrugId,
    setIndex,
    setDrugNRN,
    setDrugIndex,
    setFormData,
    drugIndex,
    isLoading,
    isIndexLoading,
    fetchError,
    fetchIndexError,
    drugData,
    drugNRN,
    notFound,
    isAuth,
    authError,
  } = useContext(DataContext);
  const [search, setSearch] = useState(drugNRN || "");
  const [radio, setRadio] = useState(false);
  const [searchIndex, setSearchIndex] = useState([]);
  const listRef = useRef(null);
  const nrnRef = useRef(null);

  useEffect(() => {
    const handleSetIndex = () => {
      if (radio && search) {
        const firstLetter = search[0].toUpperCase();
        setIndex(firstLetter);
      }
    };
    if (search && radio) {
      handleSetIndex();
    }
  }, [search, radio, setIndex, setDrugId, setDrugNRN]);

  useEffect(() => {
    if (search && drugIndex) {
      let arr = drugIndex.filter((i) =>
        i.name.toLowerCase().startsWith(search.toLowerCase())
      );
      setSearchIndex(arr.slice(0, 5));
    }
  }, [drugIndex, search]);

  useEffect(() => {
    if (nrnRef.current) {
      nrnRef.current.checked = true;
      setRadio(false);
    }
  }, []);

  const getDrugByNRN = () => {
    if (search && !radio) {
      setDrugId(null);
      setDrugNRN(search);
    }
  };

  const getDrugById = (id) => {
    if (id) {
      handleListShow();
      setDrugNRN(null);
      setDrugId(id);
    }
  };

  const handleListShow = () => {
    if (listRef.current) {
      listRef.current.classList.add("hidden");
    }
  };

  const handleAutoFill = (index) => {
    if (Array.isArray(drugData) && (index == 0 || index > 0)) {
      setFormData({
        productName: drugData[index].product_name,
        nrn: drugData[index].nrn,
        manufacturerName: drugData[index].manufacturer_name,
        manufacturerCountry: drugData[index].manufacturer_country,
        manufactureDate: "",
        expiryDate: "",
      });
    } else {
      setFormData({
        productName: drugData.product_name,
        nrn: drugData.nrn,
        manufacturerName: drugData.manufacturer_name,
        manufacturerCountry: drugData.manufacturer_country,
        manufactureDate: "",
        expiryDate: "",
      });
    }
    navigate("/report");
  };

  const handleClearForm = () => {
    setFormData({
      productName: "",
      nrn: drugNRN || "",
      manufacturerName: "",
      manufacturerCountry: "",
      manufactureDate: "",
      expiryDate: "",
    });
    navigate("/report");
  };

  return (
    <main className="p-4 max-w-5xl w-full mx-auto mt-10 md:mt-14 lg:mt-16 flex flex-col items-center gap-8 text-base min-h-screen">
      <div className="flex gap-x-2 xs:gap-x-6 xxs:flex-row flex-col">
        <div className="flex items-center">
          <input
            type="radio"
            name="hs-radio-group"
            className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
            id="hs-radio-group-1"
            data-name="NRN"
            onChange={() => setRadio(false)}
            ref={nrnRef}
          />
          <label
            htmlFor="hs-radio-group-1"
            className="text-gray-500 ml-2 dark:text-gray-400 p-1 pl-0"
          >
            NAFDAC Reg. No.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            name="hs-radio-group"
            className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
            id="hs-radio-group-2"
            data-name="name"
            onChange={() => setRadio(true)}
          />
          <label
            htmlFor="hs-radio-group-2"
            className="text-gray-500 ml-2 dark:text-gray-400 p-1 pl-0"
          >
            Drug Name
          </label>
        </div>
      </div>
      {isAuth && !authError && (
        <div className="w-[95%] sm:w-5/6 min-w-[256px] shadow-custom-1 dark:shadow-gray-800 rounded-md">
          <div>
            <label
              htmlFor="hs-trailing-button-add-on-with-icon-and-button"
              className="sr-only"
            >
              Verify
            </label>
            <div className="relative flex rounded-md mx-auto">
              <input
                type="text"
                id="hs-trailing-button-add-on-with-icon-and-button"
                name="hs-trailing-button-add-on-with-icon-and-button"
                className="py-2 xs:py-3 px-2 xs:px-4 pl-8 xs:pl-11 block w-full border-gray-200 shadow-sm rounded-l-md text-base focus:z-10 outline-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (!e.target.value) {
                    setIndex(null);
                    setDrugIndex(null);
                    setSearchIndex([]);
                  }
                  listRef.current?.classList.remove("hidden");
                }}
                onKeyDown={(e) => e.key == "Enter" && getDrugByNRN()}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-2 xs:pl-4">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </div>
              <button
                type="button"
                className="py-2 xs:py-3 px-2 xs:px-4 inline-flex flex-shrink-0 justify-center items-center rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onClick={getDrugByNRN}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
      {!isAuth && !authError && (
        <div className="flex justify-center">
          <div
            className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {authError && (
        <div className="flex flex-col gap-2 sm:gap-4 mb-6">
          <div className="flex justify-center">
            <p className="text-red-600 dark:text-red-500 dark:brightness-110 font-medium tracking-wide flex gap-2 items-center">
              <span>
                <IconContext.Provider value={{ className: "w-5 h-5" }}>
                  <MdErrorOutline />
                </IconContext.Provider>
              </span>
              <span className="whitespace-normal">{authError}</span>
            </p>
          </div>
        </div>
      )}
      <div className="w-[95%] sm:w-5/6 min-w-[256px]">
        {isIndexLoading && !fetchIndexError && radio && (
          <div className="flex justify-center">
            <div
              className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {fetchIndexError && !isIndexLoading && radio && (
          <section id="Top-Rated" className="flex flex-col gap-2 sm:gap-4 mb-6">
            <div className="flex justify-center">
              <p className="text-red-600 dark:text-red-500 dark:brightness-110 font-medium tracking-wide flex gap-2 items-center">
                <span>
                  <IconContext.Provider value={{ className: "w-5 h-5" }}>
                    <MdErrorOutline />
                  </IconContext.Provider>
                </span>
                <span className="whitespace-normal">{fetchIndexError}</span>
              </p>
            </div>
          </section>
        )}
        {search && searchIndex.length > 0 && radio && !isIndexLoading && (
          <ul
            className="bg-white dark:bg-gray-900 flex flex-col rounded-md shadow-custom-1 dark:shadow-gray-800"
            ref={listRef}
          >
            {searchIndex.slice(0, 5).map((i, index) =>
              index + 1 !== 8 ? (
                <li
                  key={index}
                  className="px-4 py-2 border-b-[1px] border-gray-200 border-opacity-30 hover:cursor-pointer"
                  onClick={() => {
                    getDrugById(i.id);
                    setSearch(i.name);
                  }}
                >
                  {i.name}
                </li>
              ) : (
                <li
                  key={index}
                  className="px-4 py-2"
                  onClick={() => {
                    getDrugById(i.id);
                    setSearch(i.name);
                  }}
                >
                  {i.name}
                </li>
              )
            )}
          </ul>
        )}
        {search &&
          radio &&
          !isIndexLoading &&
          drugIndex &&
          searchIndex.length < 1 && (
            <div className="bg-white dark:bg-gray-900 flex justify-center items-center gap-2 rounded-md shadow-custom-1 dark:shadow-gray-800 p-2">
              <div className="flex-shrink-0">
                <svg
                  className="h-4 w-4 text-blue-500 mt-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
              </div>
              <p className="flex-shrink-0">No matches found</p>
            </div>
          )}
      </div>
      {drugData && !isLoading && (
        <div className="w-[95%] sm:w-5/6 min-w-[256px] mb-8">
          {Array.isArray(drugData) ? (
            <>
              {drugData.length > 1 && (
                <b className="block font-bold py-2 mb-2">
                  Results: {`${drugData.length}`}
                </b>
              )}
              <div className="flex flex-col gap-8">
                {drugData.map((i, index) => (
                  <article
                    key={index}
                    className="bg-white dark:bg-gray-900 flex flex-col rounded-md shadow-custom-1 dark:shadow-gray-800 p-4 sm:p-5 md:p-6 gap-2 sm:gap-3 md:gap-4"
                  >
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Name:</b>
                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.product_name ? <h2>{i.product_name}</h2> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Status:</b>
                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px] flex items-center gap-1">
                        {i.status ? (
                          i.status.toLowerCase() == "active" ? (
                            <>
                              <IconContext.Provider
                                value={{
                                  className:
                                    "w-4 h-4 text-customGreen-100 dark:text-green-500",
                                }}
                              >
                                <MdCheckCircle />
                              </IconContext.Provider>
                              <span className="relative text-customGreen-100 dark:text-green-500">
                                {i.status}
                              </span>
                            </>
                          ) : (
                            <>
                              <IconContext.Provider
                                value={{
                                  className:
                                    "w-4 h-4 text-red-700 dark:text-customRed-100",
                                }}
                              >
                                <MdOutlineError />
                              </IconContext.Provider>
                              <span className="relative text-red-700 dark:text-customRed-100">
                                {i.status}
                              </span>
                            </>
                          )
                        ) : null}
                      </div>
                      {i.status && i.status.toLowerCase() != "active" && (
                        <div className="flex flex-col gap-2 sm:gap-4 mt-2 md:mt-4">
                          <div className="flex justify-center">
                            <p className="text-red-700 dark:text-customRed-100 font-medium tracking-wide flex gap-2 items-center">
                              <span>
                                <IconContext.Provider
                                  value={{ className: "w-5 h-5" }}
                                >
                                  <MdErrorOutline />
                                </IconContext.Provider>
                              </span>
                              <span className="whitespace-normal">
                                {`Drug license has expired, report its usage if the manufacture date is past ${i.expiry_date}`}
                              </span>
                            </p>
                          </div>
                          <div
                            className="self-center w-full flex justify-center"
                            onClick={() => handleAutoFill(index)}
                          >
                            <button className="w-full max-w-lg p-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md focus:z-10 focus:outline-none focus:ring-2 focus:ring-red-500">
                              Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Active Ingredients:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.active_ingredients ? (
                          <p>{i.active_ingredients.join(", ")}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Applicant Name:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.applicant_name ? <p>{i.applicant_name}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Approval Date:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.approval_date ? <p>{i.approval_date}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">ATC Code:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.atc_code ? <p>{i.atc_code}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Expiry Date:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.expiry_date ? <p>{i.expiry_date}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Form:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.form ? <p>{i.form}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Manufacturer Country:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.manufacturer_country ? (
                          <p>{i.manufacturer_country}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Manufacturer Name:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.manufacturer_name ? (
                          <p>{i.manufacturer_name}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Marketing Category:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.marketing_category ? (
                          <p>{i.marketing_category}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">NAFDAC Registration Number:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.nrn ? <p>{i.nrn}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Product Category:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.product_category ? (
                          <p>{i.product_category}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Product Description:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.product_description ? (
                          <p>
                            {i.product_description.texts ? (
                              <>
                                {i.product_description.texts.join(", ")}
                                {i.product_description.list && (
                                  <>
                                    <br />
                                    <br />
                                  </>
                                )}
                              </>
                            ) : null}
                            {i.product_description.list
                              ? i.product_description.list.join(", ")
                              : null}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">ROA:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.roa ? <p>{i.roa.join(", ")}</p> : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">SMPC:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.smpc ? (
                          i.smpc.toLowerCase().startsWith("http") ? (
                            <a
                              href={i.smpc}
                              className="text-blue-600 dark:text-blue-400"
                            >
                              Link
                            </a>
                          ) : (
                            <p>{i.smpc}</p>
                          )
                        ) : null}
                      </div>
                    </div>
                    <div className="flex pb-2 w-full flex-col">
                      <b className="font-bold">Strength:</b>

                      <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                        {i.strength ? <p>{i.strength.join(", ")}</p> : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <article className="bg-white dark:bg-gray-900 flex flex-col rounded-md shadow-custom-1 dark:shadow-gray-800 p-4 sm:p-5 md:p-6 gap-2 sm:gap-3 md:gap-4">
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Name:</b>
                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.product_name ? (
                    <h2>{drugData.product_name}</h2>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Status:</b>
                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px] flex items-center gap-1">
                  {drugData.status ? (
                    drugData.status.toLowerCase() == "active" ? (
                      <>
                        <IconContext.Provider
                          value={{
                            className:
                              "w-4 h-4 text-customGreen-100 dark:text-green-500",
                          }}
                        >
                          <MdCheckCircle />
                        </IconContext.Provider>
                        <span className="relative text-customGreen-100 dark:text-green-500">
                          {drugData.status}
                        </span>
                      </>
                    ) : (
                      <>
                        <IconContext.Provider
                          value={{
                            className:
                              "w-4 h-4 text-red-700 dark:text-customRed-100",
                          }}
                        >
                          <MdOutlineError />
                        </IconContext.Provider>
                        <span className="relative text-red-700 dark:text-customRed-100">
                          {drugData.status}
                        </span>
                      </>
                    )
                  ) : null}
                </div>
                {drugData.status &&
                  drugData.status.toLowerCase() != "active" && (
                    <div className="flex flex-col gap-2 sm:gap-4 mt-2 md:mt-4">
                      <div className="flex justify-center">
                        <p className="text-red-700 dark:text-customRed-100 font-medium tracking-wide flex gap-2 items-center">
                          <span>
                            <IconContext.Provider
                              value={{ className: "w-5 h-5" }}
                            >
                              <MdErrorOutline />
                            </IconContext.Provider>
                          </span>
                          <span className="whitespace-normal">
                            {`Drug license has expired, report its usage if the manufacture date is past ${drugData.expiry_date}`}
                          </span>
                        </p>
                      </div>
                      <div
                        className="self-center w-full flex justify-center"
                        onClick={() => handleAutoFill()}
                      >
                        <button className="w-full max-w-lg p-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md focus:z-10 focus:outline-none focus:ring-2 focus:ring-red-500">
                          Report
                        </button>
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Active Ingredients:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.active_ingredients ? (
                    <p>{drugData.active_ingredients.join(", ")}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Applicant Name:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.applicant_name ? (
                    <p>{drugData.applicant_name}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Approval Date:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.approval_date ? (
                    <p>{drugData.approval_date}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">ATC Code:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.atc_code ? <p>{drugData.atc_code}</p> : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Expiry Date:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.expiry_date ? <p>{drugData.expiry_date}</p> : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Form:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.form ? <p>{drugData.form}</p> : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Manufacturer Country:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.manufacturer_country ? (
                    <p>{drugData.manufacturer_country}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Manufacturer Name:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.manufacturer_name ? (
                    <p>{drugData.manufacturer_name}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Marketing Category:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.marketing_category ? (
                    <p>{drugData.marketing_category}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">NAFDAC Registration Number:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.nrn ? <p>{drugData.nrn}</p> : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Product Category:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.product_category ? (
                    <p>{drugData.product_category}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Product Description:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.product_description ? (
                    <p>
                      {drugData.product_description.texts ? (
                        <>
                          {drugData.product_description.texts.join(", ")}
                          {drugData.product_description.list && (
                            <>
                              <br />
                              <br />
                            </>
                          )}
                        </>
                      ) : null}
                      {drugData.product_description.list
                        ? drugData.product_description.list.join(", ")
                        : null}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">ROA:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.roa ? <p>{drugData.roa.join(", ")}</p> : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">SMPC:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.smpc ? (
                    drugData.smpc.toLowerCase().startsWith("http") ? (
                      <a
                        href={drugData.smpc}
                        className="text-blue-600 dark:text-blue-400"
                      >
                        Link
                      </a>
                    ) : (
                      <p>{drugData.smpc}</p>
                    )
                  ) : null}
                </div>
              </div>
              <div className="flex pb-2 w-full flex-col">
                <b className="font-bold">Strength:</b>

                <div className="border-2 border-gray-200 dark:border-gray-800 rounded-md p-1 bg-gray-200 dark:bg-gray-800 font-medium shadow-custom-1 shadow-gray-300 dark:shadow-gray-700 mt-2 min-h-[32px]">
                  {drugData.strength ? (
                    <p>{drugData.strength.join(", ")}</p>
                  ) : null}
                </div>
              </div>
            </article>
          )}
        </div>
      )}
      {notFound && (
        <div className="flex flex-col gap-2 sm:gap-4 mb-6">
          <div className="flex justify-center">
            <p className="text-red-600 dark:text-customRed-100 dark:brightness-110 font-medium tracking-wide flex gap-2 items-center">
              <span>
                <IconContext.Provider value={{ className: "w-5 h-5" }}>
                  <MdErrorOutline />
                </IconContext.Provider>
              </span>
              <span className="whitespace-normal">Drug is not registered</span>
            </p>
          </div>
          <div onClick={handleClearForm}>
            <button className="w-full p-2 bg-red-600 hover:bg-red-700 text-white dark:bg-500 font-bold rounded-md focus:z-10 focus:outline-none focus:ring-2 focus:ring-red-500">
              Report
            </button>
          </div>
        </div>
      )}
      {isLoading && !fetchError && (
        <div className="flex justify-center">
          <div
            className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {fetchError && !isLoading && (
        <div className="flex flex-col gap-2 sm:gap-4 mb-6">
          <div className="flex justify-center">
            <p className="text-red-600 dark:text-red-500 dark:brightness-110 font-medium tracking-wide flex gap-2 items-center">
              <span>
                <IconContext.Provider value={{ className: "w-5 h-5" }}>
                  <MdErrorOutline />
                </IconContext.Provider>
              </span>
              <span className="whitespace-normal">{fetchError}</span>
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
