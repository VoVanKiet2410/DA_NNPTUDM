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
  Alert,
} from "@mui/material";
import donationUnitService from "../../../../service/donationUnitService";

const BloodDonationUnitsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unitData, setUnitData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    unitPhotoUrl: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        setLoading(true);
        const response = await donationUnitService.getUnitById(id);
        if (response.success) {
          setUnitData(response.data);
        } else {
          setError("Không thể tải thông tin đơn vị");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setError(error.message || "Đã có lỗi xảy ra");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUnitData({ ...unitData, unitPhotoUrl: reader.result });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = {
        name: unitData.name,
        location: unitData.location,
        email: unitData.email,
        phone: unitData.phone,
        unitPhotoUrl: unitData.unitPhotoUrl,
      };

      const response = await donationUnitService.updateUnit(id, formData);
      if (response.success) {
        setSuccessMessage("Cập nhật đơn vị thành công!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/admin/blood-donation-units");
        }, 1500);
      } else {
        setError(response.message || "Không thể cập nhật đơn vị");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError(error.message || "Đã có lỗi xảy ra khi cập nhật đơn vị");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Cập nhật đơn vị hiến máu
        </Typography>

        {loading && <CircularProgress />}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div className="w-full">
              <TextField
                label="Tên đơn vị"
                name="name"
                value={unitData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Địa điểm"
                name="location"
                value={unitData.location}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Email"
                name="email"
                value={unitData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Điện thoại"
                name="phone"
                value={unitData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <Typography variant="subtitle1">Ảnh hiện tại:</Typography>
              {unitData.unitPhotoUrl && (
                <img
                  src={unitData.unitPhotoUrl}
                  alt="Current Unit"
                  className="w-[150px] h-[150px] object-cover rounded-lg"
                />
              )}
            </div>

            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
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
                {loading ? "Đang cập nhật..." : "Cập nhật đơn vị"}
              </Button>
            </div>
          </div>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BloodDonationUnitsEdit;
