import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { uploadFile } from "../../services/api";
import TransformationForm from "./TransformationForm";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DataTable from "../DataTable/DataTable";

const FileUpload = () => {
  const [uploadedTables, setUploadedTables] = useState([]);
  const [transformedData, setTransformedData] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      for (const file of acceptedFiles) {
        const response = await uploadFile(file, handleUploadError);

        if (response && response.transactions) {
          setUploadedTables((prevTables) => [
            ...prevTables,
            { name: response.file_name, data: response.transactions },
          ]);
        } else {
          console.error("Invalid response format:", response);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleUploadError = (error) => {
    console.log(error);
  };

  const handleTransformationApplied = (transformedData) => {
    setTransformedData(transformedData);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/*": [".csv", ".xlsx"],
    },
  });

  return (
    <div>
      <Card
        elevation={3}
        style={{
          margin: "auto",
          marginTop: 20,
          cursor: "pointer",
        }}
        {...getRootProps()}>
        <CardContent style={{ textAlign: "center" }}>
          <input {...getInputProps()} />
          <IconButton color="primary" aria-label="upload file" component="span">
            <CloudUploadIcon />
          </IconButton>
          <Button variant="contained" component="span">
            Upload a csv file
          </Button>
        </CardContent>
      </Card>
      <Grid container spacing={3} style={{ marginTop: 10 }}>
        {uploadedTables.map((table) => (
          <Grid item xs={12} key={table.name}>
            <Card elevation={3}>
              <CardContent>
                {transformedData ? (
                  <Typography
                    variant="h6"
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      justifyContent: "center",
                    }}>
                    File: {table.name}_updated
                  </Typography>
                ) : (
                  <Typography
                    variant="h6"
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      justifyContent: "center",
                    }}>
                    File: {table.name}
                  </Typography>
                )}
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    {/* Display DataTable with transformed data */}
                    {transformedData ? (
                      <DataTable tables={[transformedData]} />
                    ) : (
                      <DataTable tables={[table.data]} />
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <TransformationForm
                      columns={Object.keys(table.data[0])}
                      fileName={table.name}
                      onTransformationApplied={handleTransformationApplied}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FileUpload;
