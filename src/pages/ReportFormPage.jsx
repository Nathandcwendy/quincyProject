import { useEffect } from "react";
import { useContext } from "react";
import { MdCheckCircle, MdErrorOutline } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import DataContext from "../contexts/DataContext";
import TextInput from "../components/TextInput";
import DoneSVG from "../assets/done.svg";

const ReportFormPage = () => {
  const {
    setReportData,
    setFormData,
    formData,
    reportSuccess,
    reportError,
    isReportLoading,
  } = useContext(DataContext);
  // const testDate = "2018-12-20";

  useEffect(() => {
    if (reportSuccess) {
      window.scrollTo({ top: 0, left: 0, behaviour: "smooth" });
      setFormData({
        drug_name: "",
        nrn: "",
        manufacturer_name: "",
        manufacture_date: "",
        expiry_date: "",
      });
    }
  }, [reportSuccess, setFormData]);

  const textInputs = [
    {
      label: "Product Name",
      id: "productName",
      name: "productName",
      required: true,
      error: "Must not be empty",
    },
    {
      label: "NAFDAC Registration Number",
      id: "nrn",
      name: "nrn",
      pattern: "^[\\da-zA-Z]{1,5}-[\\da-zA-Z]{1,10}$",
      required: true,
      error: `Must contain "-" between two characters`,
    },
    {
      label: "Manufacturer Name",
      id: "manufacturerName",
      name: "manufacturerName",
      required: true,
      error: "Must not be empty",
    },
    {
      label: "Manufacturer Country",
      id: "manufacturerCountry",
      name: "manufacturerCountry",
      required: true,
      error: "Must not be empty",
    },
    {
      label: "Manufacture Date",
      id: "manufactureDate",
      name: "manufactureDate",
      pattern: "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
      required: true,
      error: "Must match format yyyy-mm-dd",
    },
    {
      label: "Expiry Date",
      id: "expiryDate",
      name: "expiryDate",
      pattern: "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
      required: true,
      error: "Must match format yyyy-mm-dd",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportData(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  return (
    <main className="xxs:p-4 max-w-5xl w-full mx-auto mt-10 md:mt-14 lg:mt-16 flex flex-col items-center gap-8 text-base min-h-screen justify-normal">
      {!reportSuccess && (
        <form
          onSubmit={handleSubmit}
          className="dark:bg-gray-800 p-2 xs:p-4 rounded-md shadow-custom-1 dark:shadow-gray-700 w-[95%] sm:w-5/6 min-w-[256px] flex flex-col gap-4"
        >
          {textInputs.map((i, index) => (
            <TextInput
              key={index}
              {...i}
              formData={formData}
              handleChange={handleChange}
              last={index == textInputs.length - 1 ? "true" : "false"}
            />
          ))}
          {isReportLoading && !reportError && (
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
          {!isReportLoading && (
            <button
              type="submit"
              className="py-2 xs:py-3 px-2 xs:px-4 inline-flex flex-shrink-0 justify-center items-center rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mt-2"
            >
              Submit
            </button>
          )}
          {reportError && !isReportLoading && (
            <div className="flex flex-col gap-2 sm:gap-4 mb-6">
              <div className="flex justify-center">
                <p className="text-red-600 dark:text-red-500 dark:brightness-110 font-medium tracking-wide flex gap-2 items-center">
                  <span>
                    <IconContext.Provider value={{ className: "w-5 h-5" }}>
                      <MdErrorOutline />
                    </IconContext.Provider>
                  </span>
                  <span className="whitespace-normal">{reportError}</span>
                </p>
              </div>
            </div>
          )}
        </form>
      )}
      {reportSuccess && (
        <div className="flex-col min-h-[300px] items-center justify-center flex gap-2 shadow-custom-1 dark:shadow-gray-700 rounded-md dark:bg-gray-800 w-auto min-w-[256px] p-2 xs:p-8 md:mt-[200px]">
          <div>
            <img
              src={DoneSVG}
              alt="Report Sent Successfully"
              width="200"
              height="200"
              className="xs:w-[250px] xs:h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px]"
            />
          </div>
          <div className="flex items-center justify-center gap-2 md:text-lg">
            <IconContext.Provider
              value={{
                className: "w-4 h-4 text-customGreen-100 dark:text-green-500",
              }}
            >
              <MdCheckCircle />
            </IconContext.Provider>
            <span className="relative text-customGreen-100 dark:text-green-500">
              Report Successful
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default ReportFormPage;
