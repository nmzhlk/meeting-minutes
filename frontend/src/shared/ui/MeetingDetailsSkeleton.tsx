import { Box, Card, CardContent, Skeleton } from '@mui/material';

export const MeetingDetailsSkeleton = () => {
  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Skeleton variant="rounded" width={140} height={36} sx={{ mb: 2, borderRadius: 2 }} />

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: 1.5 }} />
          </Box>
          <Skeleton variant="text" width="80%" height={24} sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', gap: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="text" width={160} height={24} />
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={140} height={24} />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="85%" height={20} />
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rounded" width="100%" height={60} sx={{ mb: 1.5, borderRadius: 2 }} />
              <Skeleton variant="rounded" width="100%" height={60} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="50%" height={28} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
