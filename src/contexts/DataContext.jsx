/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  // connectAuthEmulator,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [drugIndex, setDrugIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexLoading, setIsIndexLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fetchIndexError, setFetchIndexError] = useState(null);
  const [drugData, setDrugData] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [drugId, setDrugId] = useState(null);
  const [drugNRN, setDrugNRN] = useState(null);
  const [index, setIndex] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    nrn: drugNRN || "",
    manufacturerName: "",
    manufacturerCountry: "",
    manufactureDate: "",
    expiryDate: "",
  });

  // const BASE_URL = "http://172.20.10.3:5000/quincy-393920/us-central1/api/api";
  const BASE_URL = "/api";

  useEffect(() => {
    const abortController = new AbortController();
    const getDataIndex = async () => {
      try {
        setIsIndexLoading(true);
        setFetchIndexError(null);
        const token = await auth.currentUser.getIdToken();
        if (token) {
          const res = await axios
            .get(`${BASE_URL}/inventory/${index}`, {
              signal: abortController.signal,
              validateStatus: function (status) {
                return status == 200;
              },
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            })
            .catch((err) => {
              if (err.response?.data) {
                setFetchIndexError(err.response.data.message);
              } else {
                if (err.message.toLowerCase() == "canceled") {
                  return;
                } else {
                  setFetchIndexError(
                    err.message[0].toUpperCase() + err.message.slice(1)
                  );
                }
              }
            });
          if (res) {
            setFetchIndexError(null);
            setDrugIndex(res.data.results);
          }
        } else {
          setFetchError("Not Authorized");
        }
      } catch (err) {
        console.log(err);
        setFetchIndexError("An Error Occurred");
      } finally {
        setIsIndexLoading(false);
      }
    };
    if (index && index != "/" && isAuth) {
      getDataIndex();
    } else {
      if (index && index != "/" && !isAuth) {
        setFetchIndexError("Unauthorized, please reload");
      }
    }
    return () => {
      abortController.abort();
    };
  }, [index, isAuth]);

  useEffect(() => {
    const abortController = new AbortController();
    const getDrugByNRN = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        setDrugData(null);
        setNotFound(false);
        const token = await auth.currentUser.getIdToken();
        if (token) {
          const res = await axios
            .get(`${BASE_URL}/nrn/${drugNRN}`, {
              signal: abortController.signal,
              validateStatus: function (status) {
                return status == 200;
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .catch((err) => {
              if (err.response?.data) {
                switch (err.response.data.status) {
                  case 400:
                    setFetchError(err.response.data.message);
                    break;
                  case 403:
                    setFetchError(err.response.data.message);
                    break;
                  case 404:
                    setFetchError(null);
                    setNotFound(true);
                    break;
                  case 500:
                    setFetchError(err.response.data.message);
                    break;
                  default:
                    setFetchError(err.response.data.message);
                    break;
                }
              } else {
                if (err.message.toLowerCase() == "canceled") {
                  return;
                } else {
                  setFetchError(
                    err.message[0].toUpperCase() + err.message.slice(1)
                  );
                }
              }
            });
          if (res) {
            setFetchError(null);
            setDrugData(res.data.results);
          }
        } else {
          setFetchError("Unauthorized");
        }
      } catch (err) {
        console.log(err.message);
        setFetchError("An Error Occurred");
      } finally {
        setIsLoading(false);
      }
    };
    if (drugNRN && isAuth) {
      getDrugByNRN();
    } else {
      if (drugNRN && !isAuth) {
        setFetchError("Unauthorized, please reload");
      }
    }
    return () => {
      abortController.abort();
    };
  }, [drugNRN, isAuth]);

  useEffect(() => {
    const abortController = new AbortController();
    const getDrugById = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        setDrugData(null);
        setNotFound(false);
        const token = await auth.currentUser.getIdToken();
        if (token) {
          const res = await axios
            .get(`${BASE_URL}/id/${drugId}`, {
              signal: abortController.signal,
              validateStatus: function (status) {
                return status == 200;
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .catch((err) => {
              if (err.response?.data) {
                switch (err.response.data.status) {
                  case 400:
                    setFetchError(err.response.data.message);
                    break;
                  case 403:
                    setFetchError(err.response.data.message);
                    break;
                  case 404:
                    setFetchError(null);
                    setNotFound(true);
                    break;
                  case 500:
                    setFetchError(err.response.data.message);
                    break;
                  default:
                    setFetchError(err.response.data.message);
                    break;
                }
              } else {
                if (err.message.toLowerCase() == "canceled") {
                  return;
                } else {
                  setFetchError(
                    err.message[0].toUpperCase() + err.message.slice(1)
                  );
                }
              }
            });
          if (res) {
            setFetchError(null);
            setDrugData(res.data.result);
          }
        } else {
          setFetchError("Unauthorized");
        }
      } catch (err) {
        console.log(err);
        setFetchError("An Error Occurred");
      } finally {
        setIsLoading(false);
      }
    };
    if (drugId && isAuth) {
      getDrugById();
    } else {
      if (drugId && !isAuth) {
        setFetchError("Unauthorized, please reload");
      }
    }
    return () => {
      abortController.abort();
    };
  }, [drugId, isAuth]);

  useEffect(() => {
    const abortController = new AbortController();
    const reportDrug = async () => {
      try {
        setReportSuccess(false);
        setReportError(null);
        setIsReportLoading(true);
        const token = await auth.currentUser.getIdToken();
        if (token) {
          const res = await axios
            .post(`${BASE_URL}/report`, reportData, {
              signal: abortController.signal,
              validateStatus: function (status) {
                return status == 200;
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .catch((err) => {
              if (err.response?.data) {
                setReportError(err.response.data.message);
              } else {
                if (err.message.toLowerCase() == "canceled") {
                  return;
                } else {
                  setReportError(
                    err.message[0].toUpperCase() + err.message.slice(1)
                  );
                }
              }
            });
          if (res) {
            setReportError(null);
            console.log(res.data);
            setReportSuccess(true);
          }
        } else {
          setReportError("Unauthorized");
        }
        setIsReportLoading(false);
        const delay2 = () => {
          return new Promise((res) => {
            setTimeout(() => {
              setReportSuccess(false);
              res();
            }, 3000);
          });
        };
        await delay2();
      } catch (err) {
        console.log(err);
        setReportError("An Error Occurred");
        setIsReportLoading(false);
        console.log("done");
      }
    };

    if (reportData && isAuth) {
      reportDrug();
    } else {
      if (reportData && !isAuth) {
        setReportError("Unauthorized, please reload");
      }
    }

    return () => {
      abortController.abort();
    };
  }, [reportData, isAuth]);

  useEffect(() => {
    // connectAuthEmulator(auth, "http://172.20.10.3:9099");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        setDrugId(null);
        setDrugNRN(null);
        setIndex(null);
        setAuthError(null);
      } else {
        setIsAuth(false);
        console.log("Unauthorized, please reload");
        // setAuthError("Unauthorized, please reload");
      }
    });
    signInAnonymously(auth).catch((err) => {
      setAuthError("Unauthorized, please reload");
      console.log(err.message);
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        setDrugId,
        setIndex,
        setDrugNRN,
        setDrugIndex,
        setReportData,
        setFormData,
        drugIndex,
        drugNRN,
        isLoading,
        isIndexLoading,
        fetchError,
        fetchIndexError,
        drugData,
        notFound,
        isAuth,
        authError,
        isReportLoading,
        reportError,
        reportSuccess,
        formData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
