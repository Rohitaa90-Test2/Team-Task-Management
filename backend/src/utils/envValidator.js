const validateEnv = () => {
  const requiredEnvs = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT'
  ];

  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

  if (missingEnvs.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters long');
  }

  // Validate PORT is a number
  if (isNaN(process.env.PORT)) {
    throw new Error('PORT must be a valid number');
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = { validateEnv };
