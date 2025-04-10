import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Paper,
} from "@mui/material";

const EditFaq = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [faqData, setFaqData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Simulate fetching FAQ data on component mount
  useEffect(() => {
    const simulateFetchFaqDetails = () => {
      setLoading(true); // Start loading
      setTimeout(() => {
        // Simulate fetched data
        setFaqData({
          title: `Sample FAQ Title ${id}`,
          description: "This is a sample FAQ description.",
        });
        setLoading(false); // Stop loading
      }, 1000); // Simulate a delay of 1 second
    };

    simulateFetchFaqDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData({ ...faqData, [name]: value }); // Update FAQ data
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Start loading
    // Simulate a successful update without backend
    setTimeout(() => {
      alert("FAQ updated successfully!");
      navigate("/admin/faqs"); // Redirect to FAQ list after "successful" update
      setLoading(false); // Stop loading
    }, 1000); // Simulate a delay of 1 second
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Update FAQ
        </Typography>
        {loading && <CircularProgress />} {/* Display loading indicator */}
        {error && <Typography color="error">{error}</Typography>}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <TextField
                label="Title"
                name="title"
                value={faqData.title}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Description"
                name="description"
                value={faqData.description}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={4}
              />
            </div>

            <div className="w-full">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Updating..." : "Update FAQ"}
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </Box>
  );
};

export default EditFaq;