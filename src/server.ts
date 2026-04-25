import app from './app';

const PORT = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, () => {
  console.log(`\n  🚀 TREVORORS LABS API Server`);
  console.log(`  → Running on http://localhost:${PORT}`);
  console.log(`  → Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  → Health: http://localhost:${PORT}/api/health\n`);
});
