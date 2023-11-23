import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";

const DataTable = ({ tables }) => {
  return (
    <div>
      {tables.map((data, index) => (
        <CardContent key={index} elevation={3} style={{ marginTop: 20 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(data[0]).map((header, headerIndex) => (
                    <TableCell key={headerIndex}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.keys(row).map((key, cellIndex) => (
                      <TableCell key={cellIndex}>{row[key]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      ))}
    </div>
  );
};

export default DataTable;
