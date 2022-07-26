import React, { useState, useCallback } from "react";
import Dropzone from "./Dropzone";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import moment from "moment";
//import ReactTable from "react-table";
//import ReactDataSheet from "react-datasheet";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-datasheet/lib/react-datasheet.css";

function Modal() {
  const [date, setDate] = useState();
  const [aux, setAux] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataCsv, setDataCsv] = useState([]);

  const grid = [
    [{ value: 5, expr: "1 + 4" }, { value: 6, expr: "6" }, { value: 3 }],
    [{ value: 5, expr: "1 + 4" }, { value: 5, expr: "1 + 4" }, { value: 1 }],
  ];

  /*const onCellsChanged = (changes) =>
    changes.forEach(({ cell, row, col, value }) =>
      console.log("New expression :" + value)
    );*/

  // process CSV data
  const processData = (dataString, date) => {
    const dataStringLines = dataString?.split(/\r\n|\n/);
    const headers = dataStringLines[0]?.split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i]?.split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    var dateFilter = moment(date).format("M/D/YY");

    let result = list.filter(
      (d) => d["Posting Date"] === dateFilter && d["Amount"] > 0
    );
    //console.log(columns);
    console.log(result);
    setDataCsv(result);

    removeColumns(columns);
  };

  function removeColumns(columns) {
    let removeArray = [
      { name: "Details", selector: "Details" },
      { name: "Amount", selector: "Amount" },
      { name: "Description", selector: "Description" },
      { name: "Type", selector: "Type" },
      { name: "Check or Slip #", selector: "Check or Slip #" },
      { name: "", selector: "" },
    ];

    columns = columns.filter(
      (c) => !removeArray.some((o) => o.name === c.name)
    );

    let addArray = [
      { name: "Equity", selector: "Equity" },
      { name: "Bank Transfer", selector: "Bank Transfer" },
      { name: "Other", selector: "Other" },
      { name: "Adjusted Bank Deposit", selector: "Adjusted Bank Deposit" },
    ];

    setColumns(columns.concat(addArray));
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data, "2022-02-27");
        setAux(data);
      };
      reader.readAsBinaryString(file);
      //reader.readAsDataURL(file);

      return file;
    });
  }, []);

  /* function show() {
    processData(aux, "2022-02-27");
  }*/

  return (
    <div className="" style={{ width: window.innerWidth * 0.5 }}>
      <div className="drawerHeaderSalesActivity">
        <div>
          <Dropzone onDrop={onDrop} accept={"csv/*"} />
        </div>
        <h3>New Bank Deposit</h3>
      </div>
      

      <div>
        {
          <DataTable
            pagination
            highlightOnHover
            columns={columns}
            data={dataCsv}
          />
        }
      </div>
    </div>
  );
}

export default Modal;
