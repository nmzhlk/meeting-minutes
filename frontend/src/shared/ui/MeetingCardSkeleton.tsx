import { Card, CardContent, Box, Skeleton } from '@mui/material';

export const MeetingCardSkeleton = () => {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Skeleton variant="text" width="65%" height={32} />
          <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 1.5 }} />
        </Box>

        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="75%" height={20} sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Skeleton variant="rounded" width={110} height={24} sx={{ borderRadius: 1.5 }} />
          <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 1.5 }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="text" width={120} height={24} />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const DashboardGridSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <MeetingCardSkeleton key={index} />
      ))}
    </Box>
  );
};
