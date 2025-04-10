import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import faqService from "../../../../service/faqService";

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faqData, setFaqData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  // Fetch FAQ data on component mount
  useEffect(() => {
    const fetchFaqDetails = async () => {
      try {
        setLoading(true);
        const response = await faqService.getAllFAQs();
        const faq = response.data.find(faq => faq._id === id);
        
        if (faq) {
          setFaqData({
            title: faq.title,
            description: faq.description,
          });
        } else {
          setError("Không tìm thấy FAQ");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải thông tin FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData({ ...faqData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await faqService.updateFAQs(id, faqData);
      setNotification({
        open: true,
        message: "FAQ đã được cập nhật thành công!",
        severity: "success"
      });
      setTimeout(() => {
        navigate("/admin/faqs");
      }, 1500);
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || "Đã xảy ra lỗi khi cập nhật FAQ",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Cập nhật FAQ
        </Typography>
        
        {loading && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}
        
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <TextField
                  label="Tiêu đề"
                  name="title"
                  value={faqData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </div>

              <div className="w-full">
                <TextField
                  label="Mô tả"
                  name="description"
                  value={faqData.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                />
              </div>

              <div className="w-full mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật FAQ"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Paper>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditFaq;