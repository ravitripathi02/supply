import React, { useEffect, useState } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import "./styles.css";
export default function App() {
  const [page, setPage] = useState(1);
  const [apiData, setApiData] = useState([]);
  const [categories, setCategories] = useState({});
  const [cat, setCat] = useState("");
  const [states, setStates] = useState({});
  const [state, setState] = useState("");
  const [supply, setSupply] = useState(4842);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const BASE_URL = "https://staging.iamdave.ai";
  const HEADERS = {
    "Content-Type": "application/json",
    "X-I2CE-ENTERPRISE-ID": "dave_vs_covid",
    "X-I2CE-USER-ID": "ananth+covid@i2ce.in",
    "X-I2CE-API-KEY": "0349234-38472-1209-2837-3432434",
  };

  async function fetchData(pageNum) {
    // console.log(cat);
    let API_ENDPOINT = `/list/supply?_page_number=${pageNum}`;
    if (cat !== "") {
      API_ENDPOINT += `&category=${cat}`;
    } else if (state !== "") {
      API_ENDPOINT += `&state=${state}`;
    }
    try {
      const response = await axios.get(BASE_URL + API_ENDPOINT, {
        headers: HEADERS,
      });
      const res = await axios.get(BASE_URL + "/unique/supply/category", {
        headers: HEADERS,
      });
      const r = await axios.get(BASE_URL + "/unique/supply/state", {
        headers: HEADERS,
      });
      setStates(r.data.data);
      setCategories(res.data.data);
      // console.log(response.data);
      setApiData(response.data.data);
    } catch (error) {
      console.error("API Error:", error.message);
    }
  }

  const handleSelectState = (option) => {
    setCat("");
    setState(option);
    setSupply(states[option]);
  };
  // console.log(apiData);
  // console.log(categories);
  const nextPage = () => {
    if (page < Math.ceil(supply / 50)) setPage(page + 1);
  };
  const setCategory = (c, supp) => {
    setState("");
    setCat(c);
    setSupply(supp);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const formatDate = (date) => {
    const dateTime = new Date(date);
    return dateTime.toLocaleString("en-US", options);
  };
  useEffect(() => {
    fetchData(page);
  }, [page, cat, state]);
  const uniqueCategories = new Set();
  console.log(supply);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Dropdown state={states} selectedState={handleSelectState} />
      <h3>Categories:</h3>
      <div style={{ paddingBottom: "20px" }}>
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            onClick={() => setCategory(category, categories[category])}
          >
            {category}
          </button>
        ))}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>State</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Time</TableCell>
              {/* Add more header cells as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {apiData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.channel}</TableCell>
                <TableCell>{item.request_description}</TableCell>
                <TableCell>{item.contact_numbers[0]}</TableCell>
                <TableCell>{item.state}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{formatDate(item.source_time)}</TableCell>
                {/* Add more cells based on your data structure */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={prevPage}>Prev</Button>
      <Button onClick={nextPage}>Next</Button>
      <div>
        {page} out of {Math.ceil(supply / 50)}
      </div>
    </div>
  );
}
