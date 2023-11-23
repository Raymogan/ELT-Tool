import React, { useState } from "react";
import { applyTransformations } from "../../services/api";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const TransformationForm = ({ columns, fileName, onTransformationApplied }) => {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [transformationType, setTransformationType] = useState("");
  const [transformationValue, setTransformationValue] = useState("");
  const [appliedMessage, setAppliedMessage] = useState("");

  const handleApplyTransformation = async () => {
    try {
      if (selectedColumn && transformationValue) {
        const transformation = {
          type: transformationType,
          column: selectedColumn,
          factor: parseFloat(transformationValue),
        };

        const response = await applyTransformations(fileName, transformation);

        if (response && response.transformed_data) {
          // Pass the transformed data to the parent component
          onTransformationApplied(response.transformed_data);

          // Set the applied message
          setAppliedMessage(
            `${transformationType} ${transformationValue} to ${selectedColumn} has been applied.`
          );

          // Clear the message after a few seconds (optional)
          setTimeout(() => setAppliedMessage(""), 5000);
        } else {
          console.error("Invalid response format:", response);
        }

        // Reset the form
        setSelectedColumn("");
        setTransformationType("");
        setTransformationValue("");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Select Column</InputLabel>
        <Select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}>
          {columns.map((column) => (
            <MenuItem key={column} value={column}>
              {column}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginTop: 10 }}>
        <InputLabel>Transformation Type</InputLabel>
        <Select
          value={transformationType}
          onChange={(e) => setTransformationType(e.target.value)}>
          <MenuItem value="Multiply">Multiply</MenuItem>
          <MenuItem value="Add">Add</MenuItem>
          <MenuItem value="Subtract">Subtract</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Transformation Value"
        type="number"
        value={transformationValue}
        onChange={(e) => setTransformationValue(e.target.value)}
        fullWidth
        style={{ marginTop: 10 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyTransformation}
        style={{ marginTop: 10 }}>
        Apply Transformation
      </Button>

      {/* Display the applied message */}
      {appliedMessage && (
        <Typography variant="body1" style={{ marginTop: 10, color: "green" }}>
          {appliedMessage}
        </Typography>
      )}
    </div>
  );
};

export default TransformationForm;
