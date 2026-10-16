import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface MeetingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const MeetingFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount,
}: MeetingFiltersProps) => {
  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'ALL';

  const handleReset = () => {
    onSearchChange('');
    onStatusFilterChange('ALL');
  };

  return (
    <Box
      sx={{
        p: 2.5,
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by meeting title or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 300 }, flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
            <MenuItem value="RECORDED">Recorded</MenuItem>
            <MenuItem value="PROCESSED">Processed</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{ borderColor: 'divider', textTransform: 'none' }}
          >
            Reset
          </Button>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> sessions
      </Typography>
    </Box>
  );
};
