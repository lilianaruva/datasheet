import React, { useState, useCallback,useEffect } from "react";
import Dropzone from "./Dropzone";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import moment from "moment";
import Papa from "papaparse";
import * as R from "rambda"
//import ReactTable from "react-table";
//import ReactDataSheet from "react-datasheet";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-datasheet/lib/react-datasheet.css";
import Spreadsheet from "react-spreadsheet";

function Modal() {
  const [date, setDate] = useState();
  const [aux, setAux] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataCsv, setDataCsv] = useState([]);

  const grid = [
    [{ value: 5, expr: "1 + 4" }, { value: 6, expr: "6" }, { value: 3 }],
    [{ value: 5, expr: "1 + 4" }, { value: 5, expr: "1 + 4" }, { value: 1 }],
  ];
  const [data2, setData] = useState([]);

  /*const onCellsChanged = (changes) =>
    changes.forEach(({ cell, row, col, value }) =>
      console.log("New expression :" + value)
    );*/

  // process CSV data
  const sumAllRows =  () =>{

  }
  useEffect (()=>{
    sumAllRows();
  },[data2])
 

  const transformCSVtoArray = (data,{dateNameColumn="",depositNameColumn=""},dateToFilter=null) =>{
    let sum_deposit = 0;
    let cleanedData =  data.map(row => {
      if(row[`${depositNameColumn}`] > 0)     
      { 
        if(dateToFilter === null)
        {
          sum_deposit += parseFloat( row[`${depositNameColumn}`]);
          return [{value:row[`${dateNameColumn}`],readOnly:true},{value:row[`${depositNameColumn}`],readOnly:true}]
        }
        else
        if(dateToFilter === row[`${dateNameColumn}`]){

          sum_deposit += parseFloat(row[`${depositNameColumn}`]);
          return [{value:row[`${dateNameColumn}`],readOnly:true},{value:row[`${depositNameColumn}`],readOnly:true}]
        }
      } 
    })
    cleanedData.push([{value:"",readOnly:true},{value:sum_deposit,readOnly:true}])
    return cleanedData;
  }
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      // transorming data to adjust the spreadsheet specs
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
        // setData(transformCSVtoArray(results.data,{dateNameColumn:'Posting Date',depositNameColumn:'Amount'}));
       const dataSpreadSheet =  transformCSVtoArray(results.data,{dateNameColumn:'Posting Date',depositNameColumn:'Amount'},"02/28/2022").filter(row => row!== undefined)
       setData(dataSpreadSheet);
        },
      });
      return file;
    });
  }, []);
  const changedbtn = () =>{
    let copy = JSON.parse(JSON.stringify(data2));
    copy[0][1] = {value:"algo mejor"};

    setData(copy);
  }
  const cellChanged = (obj) =>{
    console.log(obj)
  }
  const onSelectData = (point) =>{
    console.log("Se selecciono ",point);
  }
  const onChangeSpreadSheet = (matrix)=>{
   // console.log(matrix);
    setData(matrix);
  }

  return (
    
    <div className="" style={{ width: window.innerWidth * 0.5 }}>
      <div className="drawerHeaderSalesActivity">
        <div>
          <Dropzone onDrop={onDrop} accept={"csv/*"} />
        </div>
        <h3>New Bank Deposit</h3>
      </div>
      <Spreadsheet columnLabels={["Date","Deposit","Equity","Bank Transfer","Other","Adjusted Bank Deposit"]}  onSelect={onSelectData} data={data2} onChange={onChangeSpreadSheet} />
      <button onClick={changedbtn}>change</button>
    </div>
  );
}

export default Modal;
